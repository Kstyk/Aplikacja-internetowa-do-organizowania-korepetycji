from rest_framework.permissions import BasePermission
from .models import Room


class IsInRoom(BasePermission):
    message = 'Nie masz dostępu do tego pokoju.'

    def has_permission(self, request, view):
        if request.user.is_authenticated:
            room_id = view.kwargs.get('room_id')
            try:
                room = Room.objects.get(room_id=room_id)
                return request.user in room.users.all()
            except Room.DoesNotExist:
                return False
        return False
