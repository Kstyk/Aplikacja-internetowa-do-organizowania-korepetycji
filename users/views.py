from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from users.permissions import IsStudent
from .models import Role, User
from .serializers import UserSerializer, RoleSerializer
from django.contrib.auth import get_user_model
# Create your views here.

User = get_user_model()


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsStudent])
def test_route(request):
    return Response({'text': 'Allowed'})


class RolesListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = Role.objects.all()
    serializer_class = RoleSerializer


class UsersListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = User.objects.all()
    serializer_class = UserSerializer


# http://localhost:8000/api/users/teachers?role=teacher
class TeachersListView(generics.ListAPIView):
    serializer_class = UserSerializer

    def get_queryset(self):
        queryset = User.objects.all()
        role_name = self.request.query_params.get('role')

        if role_name is not None:
            queryset = queryset.filter(role__name=role_name)
        return queryset


class UserRegistrationView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    queryset = User.objects.all()
    serializer_class = UserSerializer
