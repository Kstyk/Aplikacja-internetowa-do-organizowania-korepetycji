from rest_framework import status
from rest_framework.test import APITestCase
from users.models import User, Role
from users.serializers import *
from django import setup
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
setup()


class ListsViewTest(APITestCase):
    def setUp(self):
        self.role_teacher = Role.objects.create(name="Teacher")
        self.role_student = Role.objects.create(name="Student")
        self.student = User.objects.create_user(
            email='abc@o2.pl', password='12345678', first_name="Adam", last_name="Kowal", role=self.role_student)
        self.teacher = User.objects.create_user(
            email='abc2@o2.pl', password='123456782', first_name="Adam2", last_name="Kowal2", role=self.role_teacher)

    def test_role_list_view(self):
        expected_data = RoleSerializer(
            [self.role_teacher, self.role_student], many=True).data

        response = self.client.get(
            '/api/users/roles/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            len(response.data), len(expected_data))

    def test_users_list_view(self):
        expected_data = UserSerializer(
            [self.student, self.teacher], many=True).data

        response = self.client.get(
            '/api/users/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            len(response.data), len(expected_data))

    def test_teachers_list_view(self):
        expected_data = UserSerializer(
            [self.teacher], many=True).data

        response = self.client.get(
            '/api/users/teachers/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            len(response.data), len(expected_data))


class UserRegistrationViewTest(APITestCase):
    def setUp(self):
        self.role_teacher = Role.objects.create(name="Teacher")

    def test_user_registration_view(self):
        data = {
            "email": "hhh@o2.pl",
            "password": "12345678",
            "confirm_password": "12345678",
            "first_name": "Hubert",
            "last_name": "Hołownia",
            "role": self.role_teacher.id
        }

        response = self.client.post(
            f'/api/users/register/', data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_user_registration_view_invalid_data(self):
        data = {
            "email": "hhh@o2.pl",
            "password": "12345678",
            "confirm_password": "123456782",
            "first_name": "Hubert",
            "last_name": "Hołownia",
            "role": self.role_teacher.id
        }

        response = self.client.post(
            f'/api/users/register/', data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class UserUpdateViewTest(APITestCase):
    def setUp(self):
        self.role_teacher = Role.objects.create(name="Teacher")
        data = {
            "email": "hhh@o2.pl",
            "password": "12345678",
            "first_name": "Hubert",
            "last_name": "Hołownia",
            "role": self.role_teacher
        }
        self.user = User.objects.create(**data)

    def test_user_update_view(self):
        self.client.force_authenticate(self.user)

        data = {
            "first_name": "Kamil",
            "last_name": "Hołownia",
        }

        response = self.client.put(
            f'/api/users/edit/', data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
