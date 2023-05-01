from django.db import models
from django.contrib.auth import get_user_model
import uuid
# Create your models here.
User = get_user_model()


class Room(models.Model):
    room_id = models.CharField(max_length=10, unique=True, primary_key=True)
    users = models.ManyToManyField(User, related_name='rooms')
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.room_id


class Message(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    room = models.ForeignKey(
        Room, on_delete=models.CASCADE, related_name="messages"
    )
    from_user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="messages_from_me"
    )
    to_user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="messages_to_me"
    )
    content = models.CharField(max_length=512)
    timestamp = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    def __str__(self):
        return f"Od {self.from_user.username} do {self.to_user.get_username}: {self.content} [{self.timestamp}]"
