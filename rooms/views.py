from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.http import HttpResponse, FileResponse
from .serializers import RoomSerializer, MessageSerializer, FileSerializer, FileUploadSerializer
from users.models import User, UserDetails
from users.serializers import UserSerializer, UserProfileSerializer
import uuid
from django.shortcuts import get_object_or_404
from .paginaters import MessagePagination
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin
from rest_framework.viewsets import GenericViewSet
from .exceptions import AccessDeniedForRoom
from .models import Room, Message, File
from classes.models import Class
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.files.storage import default_storage
from .permissions import IsInRoom
from classes.models import Schedule
from classes.serializers import ScheduleSerializer
from datetime import datetime
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt

import zipfile
import io


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_room(request, room_id):
    try:
        # pobierz pokój o danym identyfikatorze
        room = Room.objects.get(room_id=room_id)
        # sprawdź, czy bieżący użytkownik ma dostęp do pokoju
        if request.user not in room.users.all():
            raise AccessDeniedForRoom()
        # zwróć dane pokoju

        users = UserSerializer(room.users.all(), many=True).data

        if room.deleted_user is not None:
            deleted_user = UserSerializer(room.deleted_user).data
        else:
            deleted_user = None

        return Response({
            'room_id': room.room_id,
            'users': users,
            'name': room.name,
            'archivized': room.archivized,
            'deleted_user': deleted_user
        })
    except Room.DoesNotExist:
        return Response({'error': 'Pokój nie istnieje.'}, status=404)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_rooms(request):
    rooms = Room.objects.filter(users=request.user, archivized=False)
    room_list = RoomSerializer(rooms, many=True).data
    room_list.sort(key=lambda room: (
        room['next_classes']['date'] if room['next_classes'] else '9999-12-31T23:59:59+00:00', room['room_id']))

    return Response(room_list)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_archivized_user_rooms(request):
    rooms = Room.objects.filter(users=request.user, archivized=True)
    room_list = RoomSerializer(rooms, many=True).data

    return Response(room_list)


@api_view(['GET'])
def get_room_users(request, room_id):
    room = Room.objects.get(room_id=room_id)

    users = room.users.all()

    if request.user not in users:
        raise AccessDeniedForRoom()
    else:
        users = users.exclude(id=request.user.id)

        if len(users) > 0:
            profile = UserDetails.objects.filter(user_id=users[0].id).first()
        else:
            profile = None

        if profile is None:
            user = users.first()
            serializer = UserSerializer(user)

            return Response(serializer.data)
        else:
            serializer = UserProfileSerializer(profile)

            return Response(serializer.data)


class MessageViewSet(ListModelMixin, GenericViewSet):
    serializer_class = MessageSerializer
    queryset = Message.objects.none()
    pagination_class = MessagePagination

    def get_queryset(self):
        room_id = self.request.query_params.get('room_id')
        room = get_object_or_404(Room, room_id=room_id)

        if self.request.user not in room.users.all():
            raise AccessDeniedForRoom()

        queryset = (
            Message.objects.filter(room=room)
            .order_by("-timestamp")
        )
        return queryset


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsInRoom])
def get_files_in_room(request, room_id):
    try:
        room = Room.objects.get(room_id=room_id)

    except Room.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    sort_by_param = request.query_params.get('sort-by', 'file_name')
    direction_param = request.query_params.get('direction', 'asc')

    files = File.objects.filter(room=room)

    if (sort_by_param == 'owner'):
        if direction_param == 'desc':
            files = files.order_by('-owner__last_name', '-owner__first_name')
        else:
            files = files.order_by('owner__last_name', 'owner__first_name')

    elif (sort_by_param != ''):
        if direction_param == 'desc':
            sort_by_param = '-' + sort_by_param

        files = files.order_by(sort_by_param)

    serializer = FileSerializer(files, many=True)
    return Response(serializer.data)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated, IsInRoom])
def download_file(request, file_id, room_id):
    file_obj = get_object_or_404(File, id=file_id)

    with open(file_obj.file_path.path, 'rb') as file:
        response = HttpResponse(
            file.read(), content_type='application/octet-stream')
        response['Content-Disposition'] = f'attachment; filename="{file_obj.file_name}"'

    return response


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated, IsInRoom])
def download_files(request, room_id):
    try:
        files = request.data.get('files')
        in_memory_zip = io.BytesIO()

        with zipfile.ZipFile(in_memory_zip, 'w') as zip:
            for file in files:
                file_obj = get_object_or_404(File, id=file['id'])

                with open(file_obj.file_path.path, 'rb') as file_opened:
                    zip.writestr(file_obj.file_name, file_opened.read())

        response = HttpResponse(
            in_memory_zip.getvalue(), content_type='application/zip')
        response['Content-Disposition'] = 'attachment; filename="files.zip"'

        return response

    except Exception as e:
        return Response(e, status=status.HTTP_400_BAD_REQUEST)


@permission_classes([IsAuthenticated, IsInRoom])
def show_file(request, file_id):
    file_obj = get_object_or_404(File, id=file_id)

    with open(file_obj.file_path.path, 'rb') as file:
        response = HttpResponse(
            file.read(), content_type='application/octet-stream')
        response['Content-Disposition'] = f'attachment; filename="{file_obj.file_name}"'

    return response


class FileUploadView(APIView):
    permission_classes = [IsAuthenticated, IsInRoom]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, room_id):
        room = Room.objects.get(room_id=room_id)
        owner = request.user
        files_data = request.data.getlist('files[]')

        # Tworzenie listy plików do serializacji
        serialized_data = []
        for file_data in files_data:
            serialized_data.append({
                'room': room.room_id,
                'owner': owner.id,
                'file_path': file_data,
            })

        serializer = FileUploadSerializer(data=serialized_data, many=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FileDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            files = request.data.get('files')

            for file in files:
                file_obj = File.objects.get(id=file['id'])
                file_obj.delete()

            return Response({'message': 'Pliki usunięte.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': e}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SchedulesInRoomAPIView(APIView):
    permission_classes = [IsAuthenticated, IsInRoom]

    def get(self, request, room_id):
        try:
            room = Room.objects.get(room_id=room_id)
            schedules = Schedule.objects.filter(classes__teacher__rooms=room)
            now = datetime.now()

            next_schedule = schedules.filter(
                date__gt=now).order_by('date').first()
            serializer = ScheduleSerializer(schedules, many=True)
            data = serializer.data

            if next_schedule:
                next_schedule_data = ScheduleSerializer(next_schedule).data
                response = {
                    'schedules': data,
                    'next_schedule': next_schedule_data
                }
                return Response(response)

            return Response(data)
        except Room.DoesNotExist:
            return Response({"error": "Pokój nie istnieje."}, status=status.HTTP_404_NOT_FOUND)


class LeavePrivateRoomView(APIView):
    permission_classes = [IsAuthenticated, IsInRoom]

    def post(self, request, room_id):
        try:
            user = request.user

            room = get_object_or_404(Room, room_id=room_id)

            future_classes = Schedule.objects.filter(
                room=room, date__gte=timezone.now())

            if future_classes.exists():
                return Response({'error': 'Nie możesz opuścić pokoju, ponieważ masz zaplanowane zajęcia.'}, status=status.HTTP_400_BAD_REQUEST)
            room.users.remove(user)
            if room.users.count() == 0:
                room.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            else:
                room.deleted_user = user
                room.archivized = True
                room.save()
                serializer = RoomSerializer(room)
                return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': e}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
