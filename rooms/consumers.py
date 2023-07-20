from django.contrib.auth import get_user_model
import json
from uuid import UUID
from django.db import models
from .models import Room, Message
from .serializers import MessageSerializer
from asgiref.sync import async_to_sync
from urllib.parse import parse_qs
from backend.settings import SECRET_KEY
from .exceptions import AccessDeniedForRoom
from rest_framework.exceptions import AuthenticationFailed

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
        else:
            print("all good")

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
        print("Disconnected")
        return super().disconnect(code)

    def get_receiver(self):
        users_list = [user.email for user in self.room.users.all()]

        for username in users_list:
            if username != self.user.email:
                return User.objects.get(email=username)

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

    # funkcja do obsluzenia typu chat_message_echo od group_send
    def chat_message_echo(self, event):
        print(event)
        self.send_json(event)

    def received_peer(self, event):
        if self.channel_name != event['sender_channel_name']:
            self.send_json(event)

    def rejected_call(self, event):
        # wysyłanie informacji o odrzuceniu połączenia tylko do dzwoniącego
        if self.channel_name != event['sender_channel_name']:
            self.send_json(event)
