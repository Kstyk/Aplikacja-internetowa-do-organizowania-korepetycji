# from django.test import TestCase
# from users.models import *


# class UserModelTest(TestCase):
#     def test_user_str(self):
#         role_teacher = Role.objects.create(name="Teacher")
#         teacher = User.objects.create_user(
#             email='abc@o2.pl', password='12345678', first_name="Adam", last_name="Kowal", role=role_teacher)

#         self.assertEqual(
#             str(teacher), f"{teacher.first_name} {teacher.last_name} {teacher.email}")


# class RoleModelTest(TestCase):
#     def test_role_str(self):
#         role_teacher = Role.objects.create(name="Teacher")

#         self.assertEqual(str(role_teacher), role_teacher.name)


# class AddressModelTest(TestCase):
#     def test_address_str(self):
#         address = Address.objects.create(
#             postal_code="43-020", street="Kowalska", building_number="32A")

#         self.assertEqual(str(
#             address), f"{address.postal_code} - {address.street} - {address.building_number}")
