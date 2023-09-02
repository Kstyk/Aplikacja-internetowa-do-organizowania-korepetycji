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

import zipfile
import io


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_room(request):
    user_email = request.data.get('user_email')
    second_user = User.objects.get(email=user_email)

    if request.user == second_user:
        print("Nie mozesz stworzyć pokoju sam ze sobą")
        return Response({'error': 'Nie możesz stworzyć pokoju sam ze sobą'}, status=400)

    room = Room.objects.filter(users=request.user).filter(users=second_user)
    if room.count() > 0:
        print("Pokój już istnieje")
        return Response({'error': 'Pokój już istnieje'}, status=400)

    room_id = uuid.uuid4().hex[:6].upper()
    while Room.objects.filter(room_id=room_id).exists():
        room_id = uuid.uuid4().hex[:6].upper()

    room = Room.objects.create(room_id=room_id)
    room.users.add(request.user)
    room.users.add(second_user)

    return Response({'room_id': room.room_id})


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
        return Response({
            'room_id': room.room_id,
            'users': [user.email for user in room.users.all()]
        })
    except Room.DoesNotExist:
        return Response({'error': 'Pokój nie istnieje.'}, status=404)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_rooms(request):
    rooms = Room.objects.filter(users=request.user)
    room_list = RoomSerializer(rooms, many=True).data
    room_list.sort(key=lambda room: (
        room['next_classes']['date'] if room['next_classes'] else '9999-12-31T23:59:59+00:00', room['room_id']))

    return Response(room_list)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users_without_room_with_requestuser(request):
    users = User.objects.exclude(id=request.user.id)

    response_data = []
    for user in users:
        room_exists = Room.objects.filter(
            users=user).filter(users=request.user)

        if not room_exists.exists():
            response_data.append(user)

    serializer = UserSerializer(response_data, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_room_users(request, room_id):
    room = Room.objects.get(room_id=room_id)

    users = room.users.all()

    if request.user not in users:
        raise AccessDeniedForRoom()
    else:
        users = users.exclude(id=request.user.id)

        profile = UserDetails.objects.filter(user_id=users[0].id).first()

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


@permission_classes([IsAuthenticated, IsInRoom])
def download_file(request, file_id):
    file_obj = get_object_or_404(File, id=file_id)

    with open(file_obj.file_path.path, 'rb') as file:
        response = HttpResponse(
            file.read(), content_type='application/octet-stream')
        response['Content-Disposition'] = f'attachment; filename="{file_obj.file_name}"'

    return response


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsInRoom])
def download_files(request):
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
    permission_classes = [IsAuthenticated, IsInRoom]

    def post(self, request, *args, **kwargs):
        try:
            files = request.data.get('files')

            for file in files:
                file_obj = File.objects.get(id=file['id'])
                file_obj.delete()

            return Response({'message': 'Files deleted successfully.'}, status=status.HTTP_200_OK)
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


# class LeavePrivateRoomView(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request, room_id):
#         try:
#             user = request.user

#             room = get_object_or_404(Room, room_id=room_id)

#             future_classes = Schedule.objects.filter(
#                 classes__in=room_classes, date__gt=timezone.now())

#             if future_classes.exists():
#                 return Response({'detail': 'You cannot leave the room with future classes scheduled.'}, status=status.HTTP_400_BAD_REQUEST)

#             room.users.remove(user)

#             serializer = RoomSerializer(room)
#             return Response(serializer.data, status=status.HTTP_200_OK)

#         except Exception as e:
#             return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
