from django.db import models
from django.contrib.auth import get_user_model
import uuid
from django.dispatch import receiver
from django.db.models.signals import pre_save
from django.core.exceptions import ValidationError


class Room(models.Model):
    room_id = models.CharField(max_length=10, unique=True, primary_key=True)
    users = models.ManyToManyField('users.User', related_name='rooms')
    archivized = models.BooleanField(default=False)
    deleted_user = models.ForeignKey(
        'users.User', null=True, blank=True, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)

    def __str__(self):
        user_names = ', '.join([user.get_full_name()
                               for user in self.users.all()])
        return f"{self.room_id} - {user_names}"


class Message(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    room = models.ForeignKey(
        Room, on_delete=models.CASCADE, related_name="messages"
    )
    from_user = models.ForeignKey(
        'users.User', on_delete=models.CASCADE, related_name="messages_from_me"
    )
    to_user = models.ForeignKey(
        'users.User', on_delete=models.CASCADE, related_name="messages_to_me"
    )
    content = models.CharField(max_length=512)
    timestamp = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    def __str__(self):
        return f"Od {self.from_user.username} do {self.to_user.get_username}: {self.content} [{self.timestamp}]"


def file_upload_path(instance, filename):
    return f'files/{instance.room.room_id}/{filename}'


class File(models.Model):
    id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    owner = models.ForeignKey('users.User', on_delete=models.CASCADE)
    file_name = models.CharField(max_length=255, blank=True, null=True)
    file_path = models.FileField(
        upload_to=file_upload_path)
    upload_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file_name


@receiver(pre_save, sender=File)
def set_file_name(sender, instance, **kwargs):
    if not instance.file_name:
        instance.file_name = instance.file_path.name.split('/')[-1]
