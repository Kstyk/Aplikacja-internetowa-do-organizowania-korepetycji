from rest_framework import serializers
from .models import Room, Message
from users.serializers import UserSerializer


class RoomSerializer(serializers.ModelSerializer):
    users = UserSerializer(many=True)

    class Meta:
        model = Room
        fields = ('room_id', 'users')


class MessageSerializer(serializers.ModelSerializer):
    from_user = serializers.SerializerMethodField()
    to_user = serializers.SerializerMethodField()
    room = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = (
            "id",
            "room",
            "from_user",
            "to_user",
            "content",
            "timestamp",
            "read"
        )

    def get_room(self, obj):
        return str(obj.room.room_id)

    def get_from_user(self, obj):
        return UserSerializer(obj.from_user).data

    def get_to_user(self, obj):
        return UserSerializer(obj.to_user).data
