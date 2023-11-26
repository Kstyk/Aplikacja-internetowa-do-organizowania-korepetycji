from rest_framework import status
from rest_framework.test import APITestCase
from users.models import User, Role
from users.serializers import *
from rooms.models import *
from cities_light.models import City, Region
from django import setup
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')


class RoomAPITestCase(APITestCase):
    def setUp(self):
        self.role_teacher = Role.objects.create(name="Teacher")
        self.role_student = Role.objects.create(name="Student")
        self.student = User.objects.create_user(
            email='abc@o2.pl', password='12345678', first_name="Adam", last_name="Kowal", role=self.role_student)
        self.student_details = UserDetails.objects.create(user=self.student)
        self.teacher = User.objects.create_user(
            email='abc2@o2.pl', password='12345678', first_name="Adam", last_name="Kowal", role=self.role_teacher)
        self.teacher_details = UserDetails.objects.create(user=self.teacher)

        self.room = Room.objects.create(room_id='5SF32H', name='Test Room')
        self.room.users.add(self.student, self.teacher)

        self.url = f'/api/rooms/{self.room.room_id}/'

    def test_get_room_authenticated_user(self):
        self.client.force_authenticate(user=self.student)

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        expected_data = {
            'room_id': str(self.room.room_id),
            'users': UserSerializer(self.room.users.all(), many=True).data,
            'name': self.room.name,
            'archivized': self.room.archivized,
            'deleted_user': None
        }
        self.assertEqual(response.data, expected_data)

    def test_get_room_unauthenticated_user(self):
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_room_nonexistent_room(self):
        nonexistent_room_id = 'nonexistent_id'
        nonexistent_url = f'/api/rooms/{nonexistent_room_id}/'

        self.client.force_authenticate(user=self.student)

        response = self.client.get(nonexistent_url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_user_rooms(self):
        self.client.force_authenticate(user=self.student)

        length = Room.objects.filter(users=self.student).count()

        response = self.client.get('/api/rooms/all-rooms/')

        self.assertEqual(len(response.data), length)

    def test_get_archivized_user_rooms(self):
        self.client.force_authenticate(user=self.student)
        self.room.archivized = True

        length = Room.objects.filter(
            users=self.student, archivized=True).count()

        response = self.client.get('/api/rooms/all-archivized-rooms/')

        self.assertEqual(len(response.data), length)

    def test_get_room_users(self):
        self.client.force_authenticate(user=self.student)

        response = self.client.get(
            f'/api/rooms/room-users/{self.room.room_id}/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_room_users_after_leave(self):
        self.client.force_authenticate(user=self.student)
        self.room.users.remove(self.teacher)

        response = self.client.get(
            f'/api/rooms/room-users/{self.room.room_id}/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
