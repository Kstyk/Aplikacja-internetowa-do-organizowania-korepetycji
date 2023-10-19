from rest_framework import status
from rest_framework.test import APITestCase, force_authenticate
from rest_framework.test import APIClient
from classes.models import Language, Class
from users.models import User, Role
from classes.serializers import *
from django import setup
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
setup()


class GetLanguagesViewTest(APITestCase):
    def setUp(self):
        self.language_data = {
            'name': 'Test Language',
        }
        self.language = Language.objects.create(**self.language_data)

    def test_get_languages(self):
        response = self.client.get('/api/classes/languages/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        expected_data = LanguageSerializer(
            Language.objects.all(), many=True).data
        self.assertEqual(response.data, expected_data)


class GetAllClassesViewTest(APITestCase):
    def setUp(self):
        self.role = Role.objects.create(name="Teacher")
        self.user = User.objects.create_user(
            email='abc@o2.pl', password='12345678', first_name="Adam", last_name="Kowal", role=self.role)
        self.language = Language.objects.create(name='English')

    def test_get_all_classes_no_filters(self):
        class1 = Class.objects.create(
            name='Class 1', teacher=self.user, language=self.language, price_for_lesson=50.00)
        class2 = Class.objects.create(
            name='Class 2', teacher=self.user, language=self.language, price_for_lesson=60.00)

        url = '/api/classes/'
        response = self.client.get(url, {'page': 1, 'page_size': 10})

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        expected_data = ClassSerializer([class2, class1], many=True).data
        self.assertEqual(response.data['classes']
                         [0]['id'], expected_data[0]['id'])
        self.assertEqual(response.data['classes']
                         [1]['id'], expected_data[1]['id'])

    def test_get_all_classes_with_filters(self):
        class1 = Class.objects.create(
            name='Class 1', teacher=self.user, language=self.language, price_for_lesson=50.00)
        class2 = Class.objects.create(
            name='Class 2', teacher=self.user, language=self.language, price_for_lesson=60.00)

        url = '/api/classes/'
        response = self.client.get(
            url, {'page': 1, 'page_size': 10, 'search_text': 'Class 2', 'min_price': 55.00})

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        expected_data = ClassSerializer([class2], many=True).data
        self.assertEqual(response.data['classes']
                         [0]['name'], expected_data[0]['name'])


class TeacherClassesViewTest(APITestCase):
    def setUp(self):
        self.role = Role.objects.create(name="Teacher")
        self.user = User.objects.create_user(
            email='abc@o2.pl', password='12345678', first_name="Adam", last_name="Kowal", role=self.role)
        self.language = Language.objects.create(name='English')
        self.class_data = {
            'teacher': self.user,
            'language': self.language,
            'name': 'Test Class',
            'price_for_lesson': 50.00,
        }
        self.classes = Class.objects.create(**self.class_data)
        self.url = '/api/classes/teacher-classes/'

    def test_teacher_classes_view(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        expected_data = ClassTeacherViewSerializer(
            Class.objects.filter(teacher=self.user), many=True).data
        self.assertEqual(response.data, expected_data)
