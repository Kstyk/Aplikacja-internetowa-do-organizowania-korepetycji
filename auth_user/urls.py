from django.urls import path, include
from rest_framework import routers
from . import views
from auth_user.views import CustomAuthToken

urlpatterns = [
    path('auth/', CustomAuthToken.as_view())
]
