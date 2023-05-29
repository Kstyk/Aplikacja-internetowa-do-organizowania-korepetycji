from django.urls import path
from .views import create_room, get_room, get_user_rooms, MessageViewSet, get_users_without_room_with_requestuser

urlpatterns = [
    path('messages/',
         MessageViewSet.as_view({'get': 'list'}), name='get_messages'),
    path('users-without-room/', get_users_without_room_with_requestuser,
         name='get_users_without_room_with_requestuser'),
    path('', create_room, name='create_room'),
    path('all-rooms/', get_user_rooms, name='get_all_rooms'),
    path('<str:room_id>/', get_room, name='get_room'),

]
