from django.conf import settings
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.http import HttpResponse, FileResponse
from .serializers import RoomSerializer, MessageSerializer, FileSerializer, FileUploadSerializer
from users.models import User, UserDetails
from users.serializers import UserSerializer, UserProfileSerializer
from django.shortcuts import get_object_or_404
from .paginaters import MessagePagination
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin
from rest_framework.viewsets import GenericViewSet
from .exceptions import AccessDeniedForRoom
from .models import Room, Message, File
from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from .permissions import IsInRoom
from classes.models import Schedule
from classes.serializers import ScheduleSerializer
from datetime import datetime
from django.utils import timezone
from azure.storage.blob import BlobServiceClient
from backend.settings_local import AZURE_CONNECTION_STRING
import zipfile
import io
from django.core.mail import send_mail


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
    room_list = RoomSerializer(rooms, many=True, context={
                               'request': request}).data
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
    room = Room.objects.get(room_id=room_id)

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
    blob_service_client = BlobServiceClient.from_connection_string(
        AZURE_CONNECTION_STRING)

    container_client = blob_service_client.get_container_client(
        'media')

    blob_name = file_obj.file_path  # Assuming file_path contains the relative blob path

    try:
        blob_client = container_client.get_blob_client(f"{blob_name}")
        blob_data = blob_client.download_blob()
        content = blob_data.readall()

        response = HttpResponse(
            content, content_type='application/octet-stream')
        response['Content-Disposition'] = f'attachment; filename="{file_obj.file_name}"'

        return response

    except Exception as e:
        return Response(f"Error: {str(e)}", status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated, IsInRoom])
def download_files(request, room_id):
    try:
        files = request.data.get('files')
        in_memory_zip = io.BytesIO()

        blob_service_client = BlobServiceClient.from_connection_string(
            AZURE_CONNECTION_STRING)

        container_client = blob_service_client.get_container_client(
            'media')

        with zipfile.ZipFile(in_memory_zip, 'w') as zip:
            for file_data in files:
                file_id = file_data['id']

                file_obj = get_object_or_404(File, id=file_id)

                blob_name = file_obj.file_path
                blob_client = container_client.get_blob_client(f"{blob_name}")

                blob_data = blob_client.download_blob()

                content = blob_data.readall()

                # Add the file to the zip archive
                zip.writestr(file_obj.file_name, content)

        response = HttpResponse(
            in_memory_zip.getvalue(), content_type='application/zip')
        response['Content-Disposition'] = 'attachment; filename="files.zip"'

        return response

    except Exception as e:
        return Response(e, status=status.HTTP_400_BAD_REQUEST)


@permission_classes([IsAuthenticated, IsInRoom])
def show_file(request, file_id):
    file_obj = get_object_or_404(File, id=file_id)
    blob_service_client = BlobServiceClient.from_connection_string(
        AZURE_CONNECTION_STRING)

    container_client = blob_service_client.get_container_client(
        'media')

    blob_name = file_obj.file_path  # Assuming file_path contains the relative blob path

    try:
        blob_client = container_client.get_blob_client(f"{blob_name}")
        blob_data = blob_client.download_blob()
        content = blob_data.readall()

        response = HttpResponse(
            content, content_type='application/octet-stream')
        response['Content-Disposition'] = f'attachment; filename="{file_obj.file_name}"'

        return response

    except Exception as e:
        return Response(f"Error: {str(e)}", status=status.HTTP_400_BAD_REQUEST)


class FileUploadView(APIView):
    permission_classes = [IsAuthenticated, IsInRoom]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, room_id):
        room = Room.objects.get(room_id=room_id)
        owner = request.user
        files_data = request.data.getlist('files[]')

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


class CancelScheduleView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Schedule.objects.all()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        user = self.request.user.id
        if instance.room.users.filter(id=user).exists():
            time_until_class_starts = instance.date - timezone.now()
            if time_until_class_starts.total_seconds() < 24 * 3600:
                return Response({"error": "Nie można odwołać zajęć mniej niż 24 godziny przed ich rozpoczęciem."},
                                status=status.HTTP_400_BAD_REQUEST)
            self.perform_destroy(instance)

            if self.request.user.id == instance.classes.teacher.id:
                mail_to = instance.student
            else:
                mail_to = instance.classes.teacher

            send_mail(
                'Odwołano zajęcia',
                f'''
                Cześć, {mail_to.first_name}

                {self.request.user.first_name} {self.request.user.last_name} odwołał zajęcia z dnia {instance.date}.

                Pozdrawiamy, zespół korki.PL''',
                settings.EMAIL_HOST_USER,
                [mail_to.email],
                fail_silently=False,
            )

            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)
