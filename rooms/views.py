from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .serializers import RoomSerializer, MessageSerializer
from users.models import User
from users.serializers import UserSerializer
import uuid
from django.shortcuts import get_object_or_404
from .paginaters import MessagePagination
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin
from rest_framework.viewsets import GenericViewSet
from .exceptions import AccessDeniedForRoom
from .models import Room, Message


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

    # generuj losowy identyfikator
    room_id = uuid.uuid4().hex[:6].upper()
    # sprawdź, czy pokój już istnieje w bazie danych
    while Room.objects.filter(room_id=room_id).exists():
        room_id = uuid.uuid4().hex[:6].upper()

    # utwórz nowy pokój z losowym identyfikatorem
    room = Room.objects.create(room_id=room_id)
    # przypisz bieżącego użytkownika do pokoju
    room.users.add(request.user)
    room.users.add(second_user)
    # zwróć odpowiedź z danymi pokoju
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
    serializer = RoomSerializer(rooms, many=True)
    return Response(serializer.data)


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


# @api_view(['GET'])
# def messages_list(request):
#     room_id = request.query_params.get('room_id')
#     room = get_object_or_404(Room, room_id=room_id)
#     messages = Message.objects.filter(room=room).order_by('-timestamp')

#     paginator = MessagePagination()
#     paginated_messages = paginator.paginate_queryset(messages, request)

#     serializer = MessageSerializer(paginated_messages, many=True)
#     return paginator.get_paginated_response(serializer.data)


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
