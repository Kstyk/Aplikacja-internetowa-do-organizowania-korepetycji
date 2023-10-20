from django.test import TestCase
from classes.models import Language, Class, PurchaseHistory, Timeslot, Schedule, Opinion
from users.models import User, Role


class LanguageModelTest(TestCase):
    def test_language_str(self):
        language = Language(name='English')
        self.assertEqual(str(language), 'English')


class ClassModelTest(TestCase):
    def test_class_str(self):
        role_teacher = Role.objects.create(name="Teacher")
        teacher = User.objects.create_user(
            email='abc@o2.pl', password='12345678', first_name="Adam", last_name="Kowal", role=role_teacher)
        language = Language.objects.create(name='English')
        my_class = Class(teacher=teacher, language=language,
                         name='Test Class', price_for_lesson=50.0)

        self.assertEqual(str(my_class), 'Test Class')


class PurchaseHistoryModelTest(TestCase):
    def test_purchase_history_str(self):
        role_teacher = Role.objects.create(name="Teacher")
        role_student = Role.objects.create(name="Student")

        student = User.objects.create_user(
            email='abc@o2.pl', password='12345678', first_name="Adam", last_name="Kowal", role=role_student)
        teacher = User.objects.create_user(
            email='abc2@o2.pl', password='123456782', first_name="Adam2", last_name="Kowal2", role=role_teacher)

        language = Language.objects.create(name='English')
        my_class = Class(teacher=teacher, language=language,
                         name='Test Class', price_for_lesson=50.0)
        purchase_history = PurchaseHistory(student=student, classes=my_class)

        self.assertEqual(str(
            purchase_history), f"{student.first_name} {student.last_name} - {my_class.name}")


class TimeslotModelTest(TestCase):
    def test_timeslot_str(self):
        role_teacher = Role.objects.create(name="Teacher")

        teacher = User.objects.create_user(
            email='abc2@o2.pl', password='123456782', first_name="Adam2", last_name="Kowal2", role=role_teacher)
        timeslot = Timeslot(teacher=teacher, day_of_week=1, timeslot_index=0)

        self.assertEqual(str(timeslot), '1 0 Adam2 Kowal2 abc2@o2.pl')


class ScheduleModelTest(TestCase):
    def test_schedule_str(self):
        role_teacher = Role.objects.create(name="Teacher")
        role_student = Role.objects.create(name="Student")

        student = User.objects.create_user(
            email='abc@o2.pl', password='12345678', first_name="Adam", last_name="Kowal", role=role_student)
        teacher = User.objects.create_user(
            email='abc2@o2.pl', password='123456782', first_name="Adam2", last_name="Kowal2", role=role_teacher)
        language = Language.objects.create(name='English')
        my_class = Class(teacher=teacher, language=language,
                         name='Test Class', price_for_lesson=50.0)
        schedule = Schedule(classes=my_class, student=student)

        self.assertEqual(
            str(schedule), '{} {}'.format(schedule.date, my_class.teacher))


class OpinionModelTest(TestCase):
    def test_opinion_str(self):
        role_teacher = Role.objects.create(name="Teacher")
        role_student = Role.objects.create(name="Student")

        student = User.objects.create_user(
            email='abc@o2.pl', password='12345678', first_name="Adam", last_name="Kowal", role=role_student)
        teacher = User.objects.create_user(
            email='abc2@o2.pl', password='123456782', first_name="Adam2", last_name="Kowal2", role=role_teacher)
        language = Language.objects.create(name='English')
        my_class = Class(teacher=teacher, language=language,
                         name='Test Class', price_for_lesson=50.0)
        opinion = Opinion(student=student, teacher=teacher,
                          classes_rated=my_class, rate=4)

        self.assertEqual(
            str(opinion), '{}, {} - {}'.format(my_class.name, student, opinion.rate))
