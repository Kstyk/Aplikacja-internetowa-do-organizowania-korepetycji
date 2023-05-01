from django.urls import path
from .views import create_room, get_room, get_user_rooms, MessageViewSet

urlpatterns = [
    path('messages/',
         MessageViewSet.as_view({'get': 'list'}), name='get_messages'),
    path('', create_room, name='create_room'),
    path('all-rooms/', get_user_rooms, name='get_all_rooms'),
    path('<str:room_id>/', get_room, name='get_room'),
]
