from django.urls import path
from .views import get_room, get_user_rooms, MessageViewSet, get_room_users, get_files_in_room, download_file, show_file, FileUploadView, FileDeleteView, download_files, SchedulesInRoomAPIView, LeavePrivateRoomView

urlpatterns = [
    path('messages/',
         MessageViewSet.as_view({'get': 'list'}), name='get_messages'),
    path('all-rooms/', get_user_rooms, name='get_all_rooms'),
    path('<str:room_id>/download-files/',
         download_files, name='download-files-as-zip'),
    path('<str:room_id>/schedules/',
         SchedulesInRoomAPIView.as_view(), name='schedules-in-room'),
    path('<str:room_id>/', get_room, name='get_room'),
    path('room-users/<str:room_id>/', get_room_users, name='room-users'),
    path('<str:room_id>/files/', get_files_in_room, name='get_files_in_room'),
    path('<str:room_id>/file/<uuid:file_id>/download/',
         download_file, name='download_file'),
    path('file/<uuid:file_id>/show/',
         show_file, name='show_file'),
    path('<str:room_id>/upload/', FileUploadView.as_view(), name='file-upload'),
    path('<str:room_id>/leave/', LeavePrivateRoomView.as_view(), name='leave-room'),
    path('file/delete/', FileDeleteView.as_view(), name='file-delete_files'),
]
