from django.http import Http404
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from users.permissions import IsStudent, IsOwnerProfile
from .models import Role, User, UserDetails, PasswordResetRequest, PrivateMessage
from .serializers import *
from django.contrib.auth import get_user_model
from cities_light.models import City, Region
from django.db.models import Count,  OuterRef, Exists, Subquery
from rest_framework.decorators import api_view
from classes.models import Class
from django.contrib.auth.hashers import check_password
from django.contrib.auth.password_validation import validate_password
from rest_framework.serializers import ValidationError
from django.core.mail import send_mail
from django.utils import timezone
import uuid
from django.conf import settings
from django.core.exceptions import ValidationError as ValidationResetPasswordError
from django.db.models import Q
from rest_framework.mixins import ListModelMixin
from rest_framework.viewsets import GenericViewSet
from .paginators import PrivateMessagePagination
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
        except UserDetails.DoesNotExist:
            raise Http404


class LoggeUserProfileView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer
    queryset = UserDetails.objects.all()

    def get_object(self):
        user = self.request.user

        try:
            return self.queryset.get(user__id=user.id)
        except:
            raise Http404


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
    top_cities = Class.objects.exclude(address__isnull=True).values('address__city').annotate(
        total_classes=Count('id')).order_by('-total_classes')[:15]

    top_cities = [{'city': CitySerializer(City.objects.filter(pk=item['address__city']).first()).data,
                   'total_classes': item['total_classes']} for item in top_cities]
    return Response(top_cities)


@api_view(['GET'])
def get_top_cities_in_teacher_address(request):
    top_cities = City.objects.annotate(num_tutors=Count(
        'cities_of_classes')).order_by('-num_tutors')[:20]

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


class PasswordResetRequestView(APIView):
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({'error': 'Niepoprawny email.'}, status=status.HTTP_404_NOT_FOUND)

            token = uuid.uuid4()
            expiration_time = timezone.now() + timezone.timedelta(hours=24)
            reset_request = PasswordResetRequest.objects.create(
                user=user, token=token, created_at=expiration_time)

            reset_link = f'http://localhost:5173/resetuj-haslo/{token}/'
            send_mail(
                'Korepetycje Online',
                f'''
                Uwaga! Jeśli to nie ty zażądałeś resetu hasła, zignoruj tę wiadomość.
                
                Kliknij w ten link, by móc zresetować hasło: {reset_link}
                
                Pozdrawiamy, zespół korki.PL''',
                settings.EMAIL_HOST_USER,
                [email],
                fail_silently=False,
            )

            return Response(status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ResetPasswordView(APIView):
    def post(self, request):
        token = request.data.get('token')
        new_password = request.data.get('new_password')
        confirm_password = request.data.get('confirm_password')

        # Ważność tokena i czy istnieje
        try:
            password_reset_request = PasswordResetRequest.objects.get(
                token=token, created_at__gte=timezone.now() - timezone.timedelta(hours=24)
            )
            user = password_reset_request.user
        except PasswordResetRequest.DoesNotExist:
            return Response({'error': 'Token jest niepoprawny lub już wygasł.'}, status=status.HTTP_400_BAD_REQUEST)
        except ValidationResetPasswordError as e:
            return Response({'error': 'Niepoprawny format tokenu.'}, status=status.HTTP_400_BAD_REQUEST)

        if new_password == confirm_password:
            user.set_password(new_password)
            user.save()
            password_reset_request.delete()
            return Response({'success': 'Hasło zostało pomyślnie zmienione.'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Hasła nie są identyczne.'}, status=status.HTTP_400_BAD_REQUEST)


class CreatePrivateMessageView(generics.CreateAPIView):
    serializer_class = CreatePrivateMessageSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(from_user=self.request.user)


class PrivateConversationsListView(generics.ListAPIView):
    serializer_class = UserPrivateMessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        messages = PrivateMessage.objects.filter(
            Q(from_user=user) | Q(to_user=user)
        )

        users = set()
        for message in messages:
            if message.from_user != user:
                users.add(message.from_user)
            if message.to_user != user:
                users.add(message.to_user)

        return users

    def get_serializer(self, *args, **kwargs):
        kwargs['context'] = {'request': self.request}
        return self.serializer_class(*args, **kwargs)


class PrivateMessageViewSet(ListModelMixin, GenericViewSet):
    serializer_class = PrivateMessageSerializer
    permission_classes = [IsAuthenticated]
    queryset = PrivateMessage.objects.none()
    pagination_class = PrivateMessagePagination

    def get_queryset(self):
        user_id = self.request.query_params.get('user_id')

        if user_id is not None:
            user = User.objects.get(pk=user_id)

            queryset = (
                PrivateMessage.objects.filter(
                    Q(Q(from_user=user) & Q(to_user=self.request.user)) | Q(Q(to_user=user) & Q(from_user=self.request.user)))
                .order_by("-timestamp")
            )
            return queryset
        else:
            return []


class UnreadPrivateMessagesCountView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        unread_count = PrivateMessage.objects.filter(
            to_user=user, read=False).count()

        return Response({'unread_count': unread_count})
