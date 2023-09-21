from django.contrib.auth import get_user_model
import json
from uuid import UUID
from django.db import models
from .models import Room, Message
from .serializers import MessageSerializer
from asgiref.sync import async_to_sync
from urllib.parse import parse_qs
from .exceptions import AccessDeniedForRoom
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import TokenError, AccessToken
from users.serializers import UserSerializer
from channels.generic.websocket import JsonWebsocketConsumer


User = get_user_model()


class UUIDEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, UUID):
            # jeśli obj jest uuid, to zwracamy po prostu wartosc uuid
            return obj.hex
        return json.JSONEncoder.default(self, obj)


class ChatConsumer(JsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.user = None
        self.room = None
        self.peer = None

    @classmethod
    def encode_json(cls, content):
        return json.dumps(content, cls=UUIDEncoder)

    def connect(self):
        room_id = self.scope['url_route']['kwargs']['room_id']

        self.room = Room.objects.get(room_id=room_id)

        query_string = parse_qs(self.scope["query_string"].decode())
        user_id = query_string.get("userId")[-1]

        self.user = User.objects.get(id=user_id)

        users_list = self.room.users.all()

        if self.user not in users_list:
            raise AccessDeniedForRoom()

        self.accept()

        async_to_sync(self.channel_layer.group_add)(
            self.room.room_id,
            self.channel_name,
        )

        messages = self.room.messages.all().order_by(
            "-timestamp")[0:20]
        message_count = self.room.messages.all().count()
        self.send_json(
            {
                "type": "last_20_messages",
                "messages": MessageSerializer(messages, many=True).data,
                "has_more": message_count > 20,
            }
        )

    def disconnect(self, code):
        return super().disconnect(code)

    def get_receiver(self):
        users_list = [user.email for user in self.room.users.all()]

        for username in users_list:
            if username != self.user.email:
                return User.objects.get(email=username)

    # funkcja do obsluzenia typu chat_message_echo od group_send

    def chat_message_echo(self, event):
        self.send_json(event)

    def received_peer(self, event):
        if self.channel_name != event['sender_channel_name']:
            self.send_json(event)

    def rejected_call(self, event):
        # wysyłanie informacji o odrzuceniu połączenia tylko do dzwoniącego
        if self.channel_name != event['sender_channel_name']:
            self.send_json(event)

    def receive_json(self, content, **kwargs):

        message_type = content["type"]

        if message_type == "peer":
            async_to_sync(self.channel_layer.group_send)(
                self.room.room_id,
                {
                    "type": "received_peer",
                    "peer": content["peer"],
                    'sender_channel_name': self.channel_name
                }
            )

        if message_type == "reject_peer":
            async_to_sync(self.channel_layer.group_send)(
                self.room.room_id,
                {
                    "type": "rejected_call",
                    "peer": content["peer"],
                    'sender_channel_name': self.channel_name
                }
            )

        if message_type == "chat_message":
            message = Message.objects.create(
                from_user=self.user,
                to_user=self.get_receiver(),
                content=content["message"],
                room=self.room
            )
            async_to_sync(self.channel_layer.group_send)(
                self.room.room_id,
                {
                    "type": "chat_message_echo",
                    "name": self.user.email,
                    "message": MessageSerializer(message).data
                }
            )

        return super().receive_json(content, **kwargs)

    ##########################


class NotificationConsumer(JsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.user = None

    def connect(self):
        token = self.scope['query_string'].decode("utf-8").split('=')[1]

        # sprawdzenie poprawności tokenu jwt
        try:
            access_token = AccessToken(token)
            user = User.objects.get(pk=access_token.payload.get("user_id"))

            # Jeśli token jest poprawny, akceptuj połączenie WebSocket
            self.user = user
            self.accept()

            self.notification_group_name = f"{self.user.id}__notifications"
            async_to_sync(self.channel_layer.group_add)(
                self.notification_group_name,
                self.channel_name,
            )

        except TokenError as e:
            # Zamknij połączenie, jeśli token jest niepoprawny
            self.close()

    def get_receiver(self, room):
        users_list = [user.email for user in room.users.all()]

        for username in users_list:
            if username != self.user.email:
                return User.objects.get(email=username)

    def receive_json(self, content, **kwargs):
        message_type = content["type"]
        if message_type == "call_incoming":
            room = Room.objects.get(room_id=content['roomId'])

            if room is not None:
                notification_group_name = f"{self.get_receiver(room).id}__notifications"
                async_to_sync(self.channel_layer.group_send)(
                    notification_group_name,
                    {
                        "type": "incomingcall",
                        "peer": content["peer"],
                        'sender_channel_name': self.channel_name,
                        'room_id': room.room_id,
                        'caller': UserSerializer(self.user).data
                    }
                )

            return super().receive_json(content, **kwargs)

    def incomingcall(self, event):
        self.send_json(event)
