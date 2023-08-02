from rest_framework import serializers
from .models import TypeOfClasses, Class, Language, Schedule
from users.serializers import UserSerializer, AddressSerializer, UserProfileSerializer
from .validators import validate_teacher_role
from django.core.validators import MinValueValidator
from users.models import User


class TypeOfClassesSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeOfClasses
        fields = '__all__'


class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = '__all__'


class ClassSerializer(serializers.ModelSerializer):
    # Zaimportowany gotowy serializer dla modelu TypeOfClasses
    type_of_classes = TypeOfClassesSerializer()
    language = LanguageSerializer()
    teacher = UserProfileSerializer(source='teacher.userdetails')

    class Meta:
        model = Class
        fields = '__all__'

    def validate_teacher_id(self, value):
        validate_teacher_role(value)
        return value


class CreateClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = '__all__'

    def create(self, validated_data):
        # Pobierz przekazanego nauczyciela z kontekstu
        return Class.objects.create(**validated_data)


class CreateScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = ['date', 'timeslot']


class ScheduleSerializer(serializers.ModelSerializer):
    classes = ClassSerializer()

    class Meta:
        model = Schedule
        fields = '__all__'


class MostPopularLanguages(serializers.ModelSerializer):
    num_classes = serializers.SerializerMethodField()

    class Meta:
        model = Language
        fields = ['id', 'name', 'slug', 'num_classes']

    def get_num_classes(self, language):
        return language.class_language.count()
