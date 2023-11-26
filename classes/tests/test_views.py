# from rest_framework import status
# from rest_framework.test import APITestCase
# from classes.models import Language, Class
# from users.models import User, Role
# from classes.serializers import *
# from django import setup
# import os
# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
# setup()


# class GetLanguagesViewTest(APITestCase):
#     def setUp(self):
#         self.language_data = {
#             'name': 'Test Language',
#         }
#         self.language = Language.objects.create(**self.language_data)

#     def test_get_languages(self):
#         response = self.client.get('/api/classes/languages/')
#         self.assertEqual(response.status_code, status.HTTP_200_OK)

#         expected_data = LanguageSerializer(
#             Language.objects.all(), many=True).data
#         self.assertEqual(response.data, expected_data)


# class GetAllClassesViewTest(APITestCase):
#     def setUp(self):
#         self.role = Role.objects.create(name="Teacher")
#         self.user = User.objects.create_user(
#             email='abc@o2.pl', password='12345678', first_name="Adam", last_name="Kowal", role=self.role)
#         self.language = Language.objects.create(name='English')

#     def test_get_all_classes_no_filters(self):
#         class1 = Class.objects.create(
#             name='Class 1', teacher=self.user, language=self.language, price_for_lesson=50.00)
#         class2 = Class.objects.create(
#             name='Class 2', teacher=self.user, language=self.language, price_for_lesson=60.00)

#         url = '/api/classes/'
#         response = self.client.get(url, {'page': 1, 'page_size': 10})

#         self.assertEqual(response.status_code, status.HTTP_200_OK)

#         expected_data = ClassSerializer([class2, class1], many=True).data
#         self.assertEqual(response.data['classes']
#                          [0]['id'], expected_data[0]['id'])
#         self.assertEqual(response.data['classes']
#                          [1]['id'], expected_data[1]['id'])

#     def test_get_all_classes_with_filters(self):
#         class1 = Class.objects.create(
#             name='Class 1', teacher=self.user, language=self.language, price_for_lesson=50.00)
#         class2 = Class.objects.create(
#             name='Class 2', teacher=self.user, language=self.language, price_for_lesson=60.00)

#         url = '/api/classes/'
#         response = self.client.get(
#             url, {'page': 1, 'page_size': 10, 'search_text': 'Class 2', 'min_price': 55.00})

#         self.assertEqual(response.status_code, status.HTTP_200_OK)

#         expected_data = ClassSerializer([class2], many=True).data
#         self.assertEqual(response.data['classes']
#                          [0]['name'], expected_data[0]['name'])


# class ClassesByIdViewTest(APITestCase):
#     def setUp(self):
#         self.role = Role.objects.create(name="Teacher")
#         self.user = User.objects.create_user(
#             email='abc@o2.pl', password='12345678', first_name="Adam", last_name="Kowal", role=self.role)
#         self.classes_data = {
#             'name': 'Classes 1',
#             'price_for_lesson': 55,
#             'teacher': self.user,
#             'place_of_classes': []
#         }
#         self.classes = Class.objects.create(**self.classes_data)

#     def test_get_languages(self):
#         response = self.client.get(f'/api/classes/{self.classes.id}/')
#         self.assertEqual(response.status_code, status.HTTP_200_OK)

#         expected_data = ClassSerializer(
#             self.classes).data
#         self.assertEqual(response.data, expected_data)


# class ClassCreateViewTest(APITestCase):
#     def setUp(self):
#         self.role = Role.objects.create(name="Teacher")
#         self.user = User.objects.create_user(
#             email='abc@o2.pl', password='12345678', first_name="Adam", last_name="Kowal", role=self.role)
#         self.user2 = User.objects.create_user(
#             email='abc2@o2.pl', password='123456789', first_name="Adam2", last_name="Kowal2", role=self.role)
#         self.language = Language.objects.create(name='English')

#     def test_create_class(self):
#         self.client.force_authenticate(user=self.user)

#         data = {
#             "name": "Test Class",
#             "language":  {"id": self.language.id},
#             "description": "Test description",
#             "price_for_lesson": 55,
#             "place_of_classes": ['online']
#         }

#         response = self.client.post(
#             '/api/classes/create/', data, format='json')

#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)
#         self.assertEqual(
#             response.data, {'success': 'Zajęcia zostały utworzone.'})

#     def test_update_class(self):
#         class_instance = Class.objects.create(
#             name="Test Class", language=self.language, description="Test description", teacher=self.user,
#             price_for_lesson=55)

#         self.client.force_authenticate(user=self.user)

#         data = {
#             "name": "Updated Class",
#             "language": {"id": self.language.id},
#             "description": "Updated description",
#             "price_for_lesson": 65,
#             "place_of_classes": ['online']
#         }

#         response = self.client.put(
#             f'/api/classes/update/{class_instance.id}/', data, format='json')

#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(
#             response.data, {'success': 'Zajęcia zostały zaktualizowane.'})

#     def test_update_class_invalid_serializer(self):
#         class_instance = Class.objects.create(
#             name="Test Class", language=self.language, description="Test description", teacher=self.user,
#             price_for_lesson=55)

#         self.client.force_authenticate(user=self.user)

#         data = {
#             "name": "Updated Class",
#             "language": {"id": self.language.id},
#             "description": "Updated description",
#             "price_for_lesson": 65
#         }

#         response = self.client.put(
#             f'/api/classes/update/{class_instance.id}/', data, format='json')

#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

#     def test_update_class_unauthorized(self):
#         class_instance = Class.objects.create(
#             name="Test Class", language=self.language, description="Test description", teacher=self.user, price_for_lesson=55)

#         self.client.force_authenticate(user=self.user2)

#         data = {
#             "name": "Updated Class2",
#             "language": {"id": self.language.id},
#             "description": "Updated description2",
#             "price_for_lesson": 66,
#             "place_of_classes": ['online']
#         }

#         response = self.client.put(
#             f'/api/classes/update/{class_instance.id}/', data, format='json')

#         self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
#         self.assertEqual(
#             response.data, {'error': 'Nie jesteś właścicielem tych zajęć.'})


# class TeacherClassesViewTest(APITestCase):
#     def setUp(self):
#         self.role = Role.objects.create(name="Teacher")
#         self.user = User.objects.create_user(
#             email='abc@o2.pl', password='12345678', first_name="Adam", last_name="Kowal", role=self.role)
#         self.language = Language.objects.create(name='English')
#         self.class_data = {
#             'teacher': self.user,
#             'language': self.language,
#             'name': 'Test Class',
#             'price_for_lesson': 50.00,
#         }
#         self.classes = Class.objects.create(**self.class_data)
#         self.url = '/api/classes/teacher-classes/'

#     def test_teacher_classes_view(self):
#         self.client.force_authenticate(user=self.user)
#         response = self.client.get(self.url)
#         self.assertEqual(response.status_code, status.HTTP_200_OK)

#         expected_data = ClassTeacherViewSerializer(
#             Class.objects.filter(teacher=self.user), many=True).data
#         self.assertEqual(response.data, expected_data)


# class TimeSlotsViewTest(APITestCase):
#     def setUp(self):
#         self.role = Role.objects.create(name="Teacher")
#         self.user = User.objects.create_user(
#             email='abc@o2.pl', password='12345678', first_name="Adam", last_name="Kowal", role=self.role)

#     def test_timeslots_create_view(self):
#         self.client.force_authenticate(user=self.user)

#         data = [
#             {
#                 "teacher": self.user.id,
#                 "timeslot_index": 1,
#                 "day_of_week": 1,
#             },
#             {
#                 "teacher": self.user.id,
#                 "timeslot_index": 2,
#                 "day_of_week": 2,
#             }
#         ]

#         response = self.client.post(
#             '/api/classes/timeslots/create/', data, format='json')

#         self.assertEqual(response.status_code, status.HTTP_200_OK)

#     def test_get_teacher_timeslots_view(self):
#         timeslot1 = Timeslot.objects.create(
#             teacher=self.user, timeslot_index=1, day_of_week=1)
#         response = self.client.get(
#             f'/api/classes/{self.user.id}/timeslots/')

#         expected_data = TimeslotSerializer(
#             [timeslot1], many=True).data

#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(response.data, expected_data)


# class SchedulesView(APITestCase):
#     def setUp(self):
#         self.role_teacher = Role.objects.create(name="Teacher")
#         self.teacher = User.objects.create_user(
#             email='abc@o2.pl', password='12345678', first_name="Adam", last_name="Kowal", role=self.role_teacher)
#         self.role_student = Role.objects.create(name="Student")
#         self.student = User.objects.create_user(
#             email='abc2@o2.pl', password='123456789', first_name="Adam2", last_name="Kowal2", role=self.role_student)

#     def test_schedule_teacher_view(self):
#         response = self.client.get(
#             f'/api/classes/{self.teacher.id}/schedule/')
#         self.assertEqual(response.status_code, status.HTTP_200_OK)

#     def test_schedule_student_view(self):
#         response = self.client.get(
#             f'/api/classes/{self.student.id}/student-schedule/')
#         self.assertEqual(response.status_code, status.HTTP_200_OK)


# class GetTopLanguagesView(APITestCase):
#     def setUp(self):
#         self.role_teacher = Role.objects.create(name="Teacher")
#         self.teacher = User.objects.create_user(
#             email='abc@o2.pl', password='12345678', first_name="Adam", last_name="Kowal", role=self.role_teacher)
#         self.language = Language.objects.create(name="English")
#         self.language2 = Language.objects.create(name="German")
#         self.classes_data = {
#             'name': 'Classes 1',
#             'price_for_lesson': 55,
#             'teacher': self.teacher,
#             'language': self.language,
#             'place_of_classes': []
#         }
#         self.classes = Class.objects.create(**self.classes_data)

#     def test_get_top_languages(self):
#         expected_data = MostPopularLanguages(
#             [self.language, self.language2], many=True).data
#         response = self.client.get(
#             f'/api/classes/languages/most-popular/')
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(response.data, expected_data)


# class PurchaseClassesViewTest(APITestCase):
#     def setUp(self):
#         self.role_teacher = Role.objects.create(name="Teacher")
#         self.teacher = User.objects.create_user(
#             email='abc@o2.pl', password='12345678', first_name="Adam", last_name="Kowal", role=self.role_teacher)
#         self.role_student = Role.objects.create(name="Student")
#         self.student = User.objects.create_user(
#             email='abc2@o2.pl', password='123456789', first_name="Adam2", last_name="Kowal2", role=self.role_student)

#         self.language = Language.objects.create(name="English")
#         self.classes_data = {
#             'name': 'Classes 1',
#             'price_for_lesson': 55,
#             'teacher': self.teacher,
#             'language': self.language,
#             'place_of_classes': []
#         }
#         self.classes = Class.objects.create(**self.classes_data)

#     def test_purchase_classes_invalid_data(self):
#         self.client.force_authenticate(user=self.student)

#         data = {
#             'selected_slots': [],
#             'classes_id': self.classes.id,
#             'place_of_classes': 'online',
#         }

#         response = self.client.post(
#             '/api/classes/purchase_classes/', data, format='json')

#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

#     def test_purchase_classes_unauthorized(self):
#         self.client.force_authenticate(user=self.teacher)

#         data = {
#             'selected_slots': ["2023-10-20T10:00:00", "2023-10-21T14:00:00"],
#             'classes_id': self.classes.id,
#             'place_of_classes': 'online',
#         }

#         response = self.client.post(
#             '/api/classes/purchase_classes/', data, format='json')

#         self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


# class PurchaseHistoryViewsTest(APITestCase):
#     def setUp(self):
#         self.role_teacher = Role.objects.create(name="Teacher")
#         self.teacher = User.objects.create_user(
#             email='abc@o2.pl', password='12345678', first_name="Adam", last_name="Kowal", role=self.role_teacher)
#         self.role_student = Role.objects.create(name="Student")
#         self.student = User.objects.create_user(
#             email='abc2@o2.pl', password='123456789', first_name="Adam2", last_name="Kowal2", role=self.role_student)
#         self.language = Language.objects.create(name="English")

#         self.classes_data = {
#             'name': 'Classes 1',
#             'price_for_lesson': 55,
#             'teacher': self.teacher,
#             'language': self.language,
#             'place_of_classes': []
#         }
#         self.classes = Class.objects.create(**self.classes_data)
#         self.purchase_history = PurchaseHistory.objects.create(
#             student=self.student, classes=self.classes, amount_of_lessons=3)

#     def test_purchase_history_list(self):
#         self.client.force_authenticate(user=self.student)

#         expected_data = PurchaseHistorySerializer(
#             PurchaseHistory.objects.filter(student=self.student), many=True).data

#         response = self.client.get(
#             '/api/classes/purchase-classes/history/?page=1&page_size=10')

#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(expected_data, response.data["results"])

#     def test_teacher_purchase_history_list(self):
#         self.client.force_authenticate(user=self.teacher)

#         expected_data = PurchaseHistorySerializer(
#             PurchaseHistory.objects.filter(classes__teacher=self.teacher), many=True).data

#         response = self.client.get(
#             '/api/classes/purchase-classes/teacher-history/?page=1&page_size=10')

#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(expected_data, response.data["results"])


# class OpinionsViewsTest(APITestCase):
#     def setUp(self):
#         self.role_teacher = Role.objects.create(name="Teacher")
#         self.teacher = User.objects.create_user(
#             email='abc@o2.pl', password='12345678', first_name="Adam", last_name="Kowal", role=self.role_teacher)
#         self.role_student = Role.objects.create(name="Student")
#         self.student = User.objects.create_user(
#             email='abc2@o2.pl', password='123456789', first_name="Adam2", last_name="Kowal2", role=self.role_student)
#         self.language = Language.objects.create(name="English")

#         self.classes_data = {
#             'name': 'Classes 1',
#             'price_for_lesson': 55,
#             'teacher': self.teacher,
#             'language': self.language,
#             'place_of_classes': []
#         }
#         self.classes = Class.objects.create(**self.classes_data)
#         self.purchase_history = PurchaseHistory.objects.create(
#             student=self.student, classes=self.classes, amount_of_lessons=3)
#         self.classes_data2 = {
#             'name': 'Classes 2',
#             'price_for_lesson': 56,
#             'teacher': self.teacher,
#             'language': self.language,
#             'place_of_classes': []
#         }
#         self.classes2 = Class.objects.create(**self.classes_data2)
#         self.purchase_history2 = PurchaseHistory.objects.create(
#             student=self.student, classes=self.classes, amount_of_lessons=3)

#         self.opinion = Opinion.objects.create(
#             student=self.student, teacher=self.teacher, classes_rated=self.classes, rate=4)

#         self.student_userdetails = UserDetails.objects.create(
#             user=self.student)
#         self.teacher_userdetails = UserDetails.objects.create(
#             user=self.teacher)

#     def test_teacher_opinions_list(self):
#         response = self.client.get(
#             f'/api/classes/{self.teacher.id}/opinions/?page=1&page_size=10')

#         expected_data = OpinionSerializer([self.opinion], many=True).data

#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(expected_data[0]['id'],
#                          response.data["results"][0]['id'])

#     def test_received_opinions_list(self):
#         self.client.force_authenticate(user=self.teacher)

#         response = self.client.get(
#             '/api/classes/my-opinions/'
#         )

#         expected_data = OpinionSerializer([self.opinion], many=True).data
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(expected_data[0]['id'],
#                          response.data["results"][0]['id'])

#     def test_added_opinions_list(self):
#         self.client.force_authenticate(user=self.student)

#         response = self.client.get('/api/classes/added-opinions/')
#         expected_data = OpinionSerializer([self.opinion], many=True).data
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(expected_data[0]['id'],
#                          response.data["results"][0]['id'])

#     def test_create_opinion_view(self):
#         self.client.force_authenticate(user=self.student)

#         data = {
#             "student": self.student.id,
#             "teacher": self.teacher.id,
#             "classes_rated": self.classes2.id,
#             "rate": 5
#         }

#         response = self.client.post(
#             '/api/classes/add-opinion/', data, format='json')

#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)

#     def test_update_opinion_view(self):
#         self.client.force_authenticate(user=self.student)
#         data = {
#             "student": self.student.id,
#             "teacher": self.teacher.id,
#             "classes_rated": self.classes.id,
#             "rate": 2
#         }

#         response = self.client.put(
#             f'/api/classes/update-opinion/{self.opinion.id}/', data, format='json')

#         self.assertEqual(response.status_code, status.HTTP_200_OK)

#     def test_delete_opinion_view_unauthenticated(self):
#         self.client.force_authenticate(user=self.teacher)

#         response = self.client.delete(
#             f'/api/classes/delete-opinion/{self.opinion.id}/')

#         self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

#     def test_delete_opinion_view(self):
#         self.client.force_authenticate(user=self.student)

#         response = self.client.delete(
#             f'/api/classes/delete-opinion/{self.opinion.id}/')

#         self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

#     def test_classes_bought_by_student_to_rate(self):
#         self.client.force_authenticate(user=self.student)

#         classes = Class.objects.create(name="sdasd", price_for_lesson=33.00,
#                                        teacher=self.teacher, language=self.language, place_of_classes=[])
#         PurchaseHistory.objects.create(
#             student=self.student, classes=classes, amount_of_lessons=3)

#         response = self.client.get(
#             f'/api/classes/purchase-classes/classes-bought-by-student-teacher/?teacher_id={self.teacher.id}')

#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(len(response.data), 1)
