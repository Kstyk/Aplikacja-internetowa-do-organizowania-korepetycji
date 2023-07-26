from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from users.permissions import IsStudent, IsOwnerProfile
from .models import Role, User, UserDetails
from .serializers import CreateUserSerializer, RoleSerializer, UserSerializer, CreateOrUpdateUserDetailsSerializer, UserProfileSerializer, UpdateUserSerializer
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from django.contrib.auth.mixins import LoginRequiredMixin

# Create your views here.

User = get_user_model()


class RolesListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Role.objects.all()
    serializer_class = RoleSerializer


class UsersListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = User.objects.all()
    serializer_class = UserSerializer


class TeachersListView(generics.ListAPIView):
    serializer_class = UserSerializer

    def get_queryset(self):
        queryset = User.objects.all()

        queryset = queryset.filter(role__name="teacher")

        return queryset


class UserRegistrationView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    queryset = User.objects.all()
    serializer_class = CreateUserSerializer


class UserUpdateView(generics.UpdateAPIView):
    serializer_class = UpdateUserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class UserDetailsCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        data["user"] = request.user.id
        serializer = CreateOrUpdateUserDetailsSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDetailsUpdateView(generics.UpdateAPIView):
    queryset = UserDetails.objects.all()
    serializer_class = CreateOrUpdateUserDetailsSerializer
    permission_classes = [IsOwnerProfile]
    lookup_field = 'pk'

    def put(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(
            instance, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserProfileSerializer
    queryset = UserDetails.objects.all()

    def get_object(self):
        user_id = self.kwargs.get('user_id')

        try:
            return self.queryset.get(user__id=user_id)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)
