from django.urls import path, include
from rest_framework import routers
from .views import check_user_in_conversation
from auth_user.views import CustomAuthToken

urlpatterns = [
    path('<str:name>/check_user/', check_user_in_conversation,
         name="check_user_in_conversation")
]
