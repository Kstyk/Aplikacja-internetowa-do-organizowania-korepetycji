from django.urls import path, include
from rest_framework import routers
from .views import check_user_in_conversation, conversation_users
from auth_user.views import CustomAuthToken

urlpatterns = [
    path('<str:name>/check_user/', check_user_in_conversation,
         name="check_user_in_conversation"),
    path('get-users/<str:conversation_name>',
         conversation_users, name="conversation_users")
]
