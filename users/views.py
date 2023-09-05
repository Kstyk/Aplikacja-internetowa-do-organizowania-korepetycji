from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from users.permissions import IsStudent, IsOwnerProfile
from .models import Role, User, UserDetails
from .serializers import CreateUserSerializer, RoleSerializer, UserSerializer, CreateOrUpdateUserDetailsSerializer, UserProfileSerializer, UpdateUserSerializer, VoivodeshipSerializer, CitySerializer, MostPopularCitySerializer, ChangePasswordSerializer
from django.contrib.auth import get_user_model
from cities_light.models import City, Region
from django.db.models import Count,  OuterRef, Exists, Subquery
from rest_framework.decorators import api_view
from classes.models import Class
from django.contrib.auth.hashers import check_password
from django.contrib.auth.password_validation import validate_password
from rest_framework.serializers import ValidationError

# Create your views here.

User = get_user_model()


class RolesListView(generics.ListAPIView):
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


class UserRegistrationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        user_serializer = CreateUserSerializer(data=request.data)
        if user_serializer.is_valid():
            user = user_serializer.save()

            # Tworzenie obiektu UserDetails
            user_details_data = {
                'user': user.id
            }
            user_details_serializer = CreateOrUpdateUserDetailsSerializer(
                data=user_details_data)
            if user_details_serializer.is_valid():
                user_details_serializer.save()
            else:
                user.delete()  # Jeśli UserDetails się nie powiedzie, usuń użytkownika
                return Response(user_details_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            return Response(user_serializer.data, status=status.HTTP_201_CREATED)
        return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserUpdateView(generics.UpdateAPIView):
    serializer_class = UpdateUserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class BaseUserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class UserDetailsUpdateView(generics.UpdateAPIView):
    queryset = UserDetails.objects.all()
    serializer_class = CreateOrUpdateUserDetailsSerializer
    permission_classes = [IsOwnerProfile]

    def get_object(self):
        user = self.request.user
        userdetails = UserDetails.objects.filter(user=user).first()
        return userdetails

    def put(self, request, *args, **kwargs):
        print(self.get_object())
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


class LoggeUserProfileView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer
    queryset = UserDetails.objects.all()

    def get_object(self):
        user = self.request.user

        try:
            return self.queryset.get(user__id=user.id)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)


class VoivodeshipListView(generics.ListAPIView):
    serializer_class = VoivodeshipSerializer
    queryset = Region.objects.all()


class CityListView(generics.ListAPIView):
    serializer_class = CitySerializer
    queryset = City.objects.all()

    def get_queryset(self):
        queryset = self.queryset
        name = self.request.query_params.get('name', None)

        if name is not None:
            queryset = queryset.filter(name__istartswith=name)

        return queryset


class CityByIdView(generics.RetrieveAPIView):
    serializer_class = CitySerializer
    queryset = City.objects.all()
    lookup_field = 'pk'


@api_view(['GET'])
def get_top_cities(request):
    teacher_subquery = Class.objects.filter(
        teacher__userdetails__cities_of_work=OuterRef('id')
    ).values('teacher__userdetails__cities_of_work').annotate(count=Count('teacher__userdetails__cities_of_work')).values('count')

    top_cities = City.objects.annotate(
        has_tutors=Exists(teacher_subquery.filter(
            teacher__userdetails__cities_of_work=OuterRef('id')))
    ).filter(has_tutors=True).annotate(
        num_tutors=Subquery(
            teacher_subquery.filter(
                teacher__userdetails__cities_of_work=OuterRef('id')).values('count')
        )
    ).values('id', 'num_tutors', 'slug', 'name',
             'search_names', 'region_id').order_by('-num_tutors')[:20]

    return Response(top_cities)


@api_view(['GET'])
def get_top_cities_in_teacher_address(request):
    top_cities = City.objects.annotate(num_tutors=Count(
        'cities_of_work')).order_by('-num_tutors')[:20]

    city_serializer = MostPopularCitySerializer(top_cities, many=True)

    return Response(city_serializer.data)


class ChangePasswordView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        user = self.request.user
        serializer = ChangePasswordSerializer(data=request.data)

        if serializer.is_valid():
            old_password = serializer.validated_data['old_password']
            new_password = serializer.validated_data['new_password']

            try:
                validate_password(new_password, user=user)
            except Exception as e:
                return Response({"new_password": e}, status=status.HTTP_400_BAD_REQUEST)

            try:
                if not check_password(old_password, user.password):
                    raise ValidationError(
                        "Obecne hasło jest niepoprawne.")
            except ValidationError as ve:
                return Response({'old_password': ve.detail}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(new_password)
            user.save()
            return Response({"message": "Hasło zostało pomyślnie zmienione."}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
