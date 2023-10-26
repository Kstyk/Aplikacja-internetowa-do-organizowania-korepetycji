# from rest_framework import status
# from rest_framework.test import APITestCase
# from users.models import User, Role, PasswordResetRequest, PrivateMessage
# from cities_light.models import City, Region
# from users.serializers import *
# from django import setup
# import os
# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
# setup()


# class ListsViewTest(APITestCase):
#     def setUp(self):
#         self.role_teacher = Role.objects.create(name="Teacher")
#         self.role_student = Role.objects.create(name="Student")
#         self.student = User.objects.create_user(
#             email='abc@o2.pl', password='12345678', first_name="Adam", last_name="Kowal", role=self.role_student)
#         self.teacher = User.objects.create_user(
#             email='abc2@o2.pl', password='123456782', first_name="Adam2", last_name="Kowal2", role=self.role_teacher)

#     def test_role_list_view(self):
#         expected_data = RoleSerializer(
#             [self.role_teacher, self.role_student], many=True).data

#         response = self.client.get(
#             '/api/users/roles/')

#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(
#             len(response.data), len(expected_data))

#     def test_users_list_view(self):
#         expected_data = UserSerializer(
#             [self.student, self.teacher], many=True).data

#         response = self.client.get(
#             '/api/users/')

#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(
#             len(response.data), len(expected_data))

#     def test_teachers_list_view(self):
#         expected_data = UserSerializer(
#             [self.teacher], many=True).data

#         response = self.client.get(
#             '/api/users/teachers/')

#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(
#             len(response.data), len(expected_data))


# class UserRegistrationViewTest(APITestCase):
#     def setUp(self):
#         self.role_teacher = Role.objects.create(name="Teacher")

#     def test_user_registration_view(self):
#         data = {
#             "email": "hhh@o2.pl",
#             "password": "12345678",
#             "confirm_password": "12345678",
#             "first_name": "Hubert",
#             "last_name": "Hołownia",
#             "role": self.role_teacher.id
#         }

#         response = self.client.post(
#             f'/api/users/register/', data, format='json')

#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)

#     def test_user_registration_view_invalid_data(self):
#         data = {
#             "email": "hhh@o2.pl",
#             "password": "12345678",
#             "confirm_password": "123456782",
#             "first_name": "Hubert",
#             "last_name": "Hołownia",
#             "role": self.role_teacher.id
#         }

#         response = self.client.post(
#             f'/api/users/register/', data, format='json')

#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


# class UserUpdateViewTest(APITestCase):
#     def setUp(self):
#         self.role_teacher = Role.objects.create(name="Teacher")
#         data = {
#             "email": "hhh@o2.pl",
#             "password": "12345678",
#             "first_name": "Hubert",
#             "last_name": "Hołownia",
#             "role": self.role_teacher
#         }
#         self.user = User.objects.create(**data)

#         self.userdetails = UserDetails.objects.create(
#             user=self.user, place_of_classes=[])

#     def test_user_update_view(self):
#         self.client.force_authenticate(self.user)

#         data = {
#             "first_name": "Kamil",
#             "last_name": "Hołownia",
#         }

#         response = self.client.put(
#             f'/api/users/edit/', data, format='json')

#         self.assertEqual(response.status_code, status.HTTP_200_OK)

#     def test_userdetails_update_view(self):
#         self.client.force_authenticate(self.user)

#         data = {
#             "user": self.user.id,
#             "place_of_classes": [],
#             "year_of_birth": 1994
#         }

#         response = self.client.put(
#             f'/api/users/profile/edit-informations/', data, format='json')

#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(response.data["year_of_birth"], 1994)

#     def test_userdetails_update_view_invalid_data(self):
#         self.client.force_authenticate(self.user)

#         data = {
#             "user": self.user.id,
#             "place_of_classes": [],
#             "year_of_birth": -45
#         }

#         response = self.client.put(
#             f'/api/users/profile/edit-informations/', data, format='json')

#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


# class ProfileViewsTest(APITestCase):
#     def setUp(self):
#         self.role_teacher = Role.objects.create(name="Teacher")
#         data = {
#             "email": "hhh@o2.pl",
#             "password": "12345678",
#             "first_name": "Hubert",
#             "last_name": "Hołownia",
#             "role": self.role_teacher
#         }
#         self.user = User.objects.create(**data)
#         data2 = {
#             "email": "hhh2@o2.pl",
#             "password": "123456782",
#             "first_name": "Hubert",
#             "last_name": "Hołownia",
#             "role": self.role_teacher
#         }
#         self.user2 = User.objects.create(**data2)

#         self.userdetails = UserDetails.objects.create(
#             user=self.user, place_of_classes=[])

#     def test_base_user_view(self):
#         self.client.force_authenticate(self.user)

#         expected_data = UserSerializer(self.user).data

#         response = self.client.get(
#             '/api/users/profile/base-user/')

#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(response.data, expected_data)

#     def test_user_profile_view(self):
#         user_id = self.user.id

#         expected_data = UserProfileSerializer(self.userdetails).data

#         response = self.client.get(
#             f'/api/users/profile/{user_id}/')

#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(response.data, expected_data)

#     def test_user_profile_view_not_found(self):
#         user_id = 99999

#         response = self.client.get(
#             f'/api/users/profile/{user_id}/')

#         self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

#     def test_logged_user_profile_view(self):
#         self.client.force_authenticate(self.user)

#         expected_data = UserProfileSerializer(self.userdetails).data

#         response = self.client.get(
#             f'/api/users/profile/')

#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(response.data, expected_data)

#     def test_logged_user_profile_view_not_found(self):
#         self.client.force_authenticate(self.user2)

#         response = self.client.get(
#             f'/api/users/profile/')

#         self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


# class ChangePasswordViewTest(APITestCase):
#     def setUp(self):
#         self.role_teacher = Role.objects.create(name="Teacher")
#         data = {
#             "email": "hhasdasdadsadasdh@o2.pl",
#             "password": "12345678",
#             "first_name": "Hubert",
#             "last_name": "Hołownia",
#             "role": self.role_teacher
#         }
#         self.user = User.objects.create_user(**data)

#     def test_change_password_view(self):
#         self.client.force_authenticate(self.user)
#         data = {
#             "old_password": "12345678",
#             "new_password": "mk45ujGf389",
#             "confirm_new_password": "mk45ujGf389"
#         }

#         response = self.client.post(
#             f'/api/users/change-password/', data, format='json')

#         self.assertEqual(response.status_code, status.HTTP_200_OK)

#     def test_change_password_view_invalid_old_password(self):
#         self.client.force_authenticate(self.user)
#         data = {
#             "old_password": "123456789",
#             "new_password": "mk45ujGf389",
#             "confirm_new_password": "mk45ujGf389"
#         }

#         response = self.client.post(
#             f'/api/users/change-password/', data, format='json')

#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

#     def test_change_password_view_not_equal_new_passwords(self):
#         self.client.force_authenticate(self.user)
#         data = {
#             "old_password": "12345678",
#             "new_password": "mk45ujGf389g",
#             "confirm_new_password": "mk45ujGf389"
#         }

#         response = self.client.post(
#             f'/api/users/change-password/', data, format='json')

#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

#     def test_change_password_view_invalid_new_password(self):
#         self.client.force_authenticate(self.user)
#         data = {
#             "old_password": "12345678",
#             "new_password": "11111111",
#             "confirm_new_password": "11111111"
#         }

#         response = self.client.post(
#             f'/api/users/change-password/', data, format='json')

#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


# class PasswordResetRequestViewTest(APITestCase):
#     def setUp(self):
#         self.role_teacher = Role.objects.create(name="Teacher")
#         data = {
#             "email": "hhasdasdadsadasdh@o2.pl",
#             "password": "12345678",
#             "first_name": "Hubert",
#             "last_name": "Hołownia",
#             "role": self.role_teacher
#         }
#         self.user = User.objects.create_user(**data)

#     def test_password_request(self):
#         data = {"email": "hhasdasdadsadasdh@o2.pl"}

#         response = self.client.post(
#             f'/api/users/reset-password-request/', data, format='json')

#         self.assertEqual(response.status_code, status.HTTP_200_OK)

#     def test_password_request_Wrong_email(self):
#         data = {"email": "hhasdasdadsadasdh@o2.com"}

#         response = self.client.post(
#             f'/api/users/reset-password-request/', data, format='json')

#         self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

#     def test_password_request_invalid_serializer(self):
#         data = {"email": "hhasdasdadsadasdh"}

#         response = self.client.post(
#             f'/api/users/reset-password-request/', data, format='json')

#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


# class ResetPasswordViewTest(APITestCase):
#     def setUp(self):

#         self.role_teacher = Role.objects.create(name="Teacher")
#         data = {
#             "email": "hhasdasdadsadasdh@o2.pl",
#             "password": "12345678",
#             "first_name": "Hubert",
#             "last_name": "Hołownia",
#             "role": self.role_teacher
#         }
#         self.user = User.objects.create_user(**data)

#         self.reset_request = PasswordResetRequest.objects.create(
#             user=self.user)

#     def test_reset_passowrd_view(self):
#         data = {
#             "token": self.reset_request.token,
#             "new_password": "987654321q",
#             "confirm_password": "987654321q"
#         }

#         response = self.client.post(
#             f'/api/users/reset-password/', data, format='json')

#         self.assertEqual(response.status_code, status.HTTP_200_OK)

#     def test_reset_passowrd_view_different_password(self):
#         data = {
#             "token": self.reset_request.token,
#             "new_password": "987654321q2",
#             "confirm_password": "987654321q"
#         }

#         response = self.client.post(
#             f'/api/users/reset-password/', data, format='json')

#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

#     def test_reset_passowrd_view_expired_token(self):
#         data = {
#             "token": "a7eebb6f-36f4-4d8d-91d8-ecc2e130d4c9",
#             "new_password": "987654321q",
#             "confirm_password": "987654321q"
#         }

#         response = self.client.post(
#             f'/api/users/reset-password/', data, format='json')

#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

#     def test_reset_passowrd_view_invalid_token(self):
#         data = {
#             "token": "a7eebb6f-36f4-ecc2e130d4c9",
#             "new_password": "987654321q",
#             "confirm_password": "987654321q"
#         }

#         response = self.client.post(
#             f'/api/users/reset-password/', data, format='json')

#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


# class PrivateMessageViews(APITestCase):
#     def setUp(self):
#         self.role_teacher = Role.objects.create(name="Teacher")
#         self.teacher = User.objects.create_user(
#             email='abc@o2.pl', password='12345678', first_name="Adam", last_name="Kowal", role=self.role_teacher)

#         self.teacher_ud = UserDetails.objects.create(user=self.teacher)

#         self.role_student = Role.objects.create(name="Student")
#         self.student = User.objects.create_user(
#             email='abc2@o2.pl', password='123456789', first_name="Adam2", last_name="Kowal2", role=self.role_student)
#         self.student_ud = UserDetails.objects.create(user=self.student)

#         self.private_message = PrivateMessage.objects.create(
#             from_user=self.student, to_user=self.teacher, content="abcd")
#         self.private_message = PrivateMessage.objects.create(
#             from_user=self.teacher, to_user=self.student, content="abcd")

#     def test_create_private_message_view(self):
#         self.client.force_authenticate(self.teacher)

#         data = {
#             "to_user": self.student.id,
#             "content": "abc"
#         }

#         response = self.client.post(
#             f'/api/users/send-private-message/', data, format='json')

#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)

#     def test_private_conversations_list_view(self):
#         self.client.force_authenticate(self.student)

#         response = self.client.get(
#             f'/api/users/private-conversations/')

#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(len(response.data), 1)

#     def test_private_message_viewset(self):
#         self.client.force_authenticate(self.student)
#         response = self.client.get(
#             f'/api/users/private-conversation/messages/?user_id={self.teacher.id}')

#         self.assertEqual(response.status_code, status.HTTP_200_OK)

#     def test_private_message_viewset_none_userid(self):
#         self.client.force_authenticate(self.student)
#         response = self.client.get(
#             f'/api/users/private-conversation/messages/')

#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(response.data['results'], [])

#     def test_unread_messages_count_view(self):
#         self.client.force_authenticate(self.student)
#         response = self.client.get(
#             f'/api/users/unread-messages-count/')

#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(response.data['unread_count'], 1)
