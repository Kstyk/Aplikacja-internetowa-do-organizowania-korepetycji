from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync
from .models import Conversation, Message
from chat.api.serializers import MessageSerializer
from django.contrib.auth import get_user_model
import json
from uuid import UUID

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
        self.conversation_name = None
        self.conversation = None

    @classmethod
    def encode_json(cls, content):
        return json.dumps(content, cls=UUIDEncoder)

    def connect(self):
        self.user = self.scope["user"]
        if not self.user.is_authenticated:
            return

        self.accept()
        self.conversation_name = f"{self.scope['url_route']['kwargs']['conversation_name']}"

        usernames = self.conversation_name.split("_")
        if self.user.username not in usernames:
            self.close()
            return

        self.conversation, created = Conversation.objects.get_or_create(
            name=self.conversation_name)

        async_to_sync(self.channel_layer.group_add)(
            self.conversation_name,
            self.channel_name,
        )

        messages = self.conversation.messages.all().order_by(
            "-timestamp")[0:20]
        message_count = self.conversation.messages.all().count()
        self.send_json(
            {
                "type": "last_50_messages",
                "messages": MessageSerializer(messages, many=True).data,
                "has_more": message_count > 20,
            }
        )

    def disconnect(self, code):
        print("Disconnected")
        return super().disconnect(code)

    def receive_json(self, content, **kwargs):
        usernames = self.conversation_name.split("_")
        if self.user.username not in usernames:
            return

        message_type = content["type"]

        if message_type == "peer":
            print(content["peer"])

            async_to_sync(self.channel_layer.group_send)(
                self.conversation_name,
                {
                    "type": "received_peer",
                    "peer": content["peer"],
                    'sender_channel_name': self.channel_name
                }
            )

        if message_type == "chat_message":
            message = Message.objects.create(
                from_user=self.user,
                to_user=self.get_receiver(),
                content=content["message"],
                conversation=self.conversation
            )
            async_to_sync(self.channel_layer.group_send)(
                self.conversation_name,
                {
                    "type": "chat_message_echo",
                    "name": self.user.username,
                    "message": MessageSerializer(message).data
                }
            )

        return super().receive_json(content, **kwargs)

    def get_receiver(self):
        usernames = self.conversation_name.split("_")
        for username in usernames:
            if username != self.user.username:
                return User.objects.get(username=username)

    ##########################

    # funkcja do obsluzenia typu chat_message_echo od group_send
    def chat_message_echo(self, event):
        print(event)
        self.send_json(event)

    def received_peer(self, event):
        if self.channel_name != event['sender_channel_name']:
            print("Hej")
            print(self.channel_name)
            print(event['sender_channel_name'])
            print(event)
            self.send_json(event)
        else:
            print("didnt get it")
