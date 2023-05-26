from rest_framework import serializers
from .models import TypeOfClasses, Class, Language
from users.serializers import UserSerializer
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
    teacher = UserSerializer()  # Zaimportowany gotowy serializer dla modelu User
    # Zaimportowany gotowy serializer dla modelu TypeOfClasses
    type_of_classes = TypeOfClassesSerializer()
    language = LanguageSerializer()

    class Meta:
        model = Class
        fields = '__all__'

    def validate_teacher_id(self, value):
        validate_teacher_role(value)
        return value


class CreateClassSerializer(serializers.Serializer):
    teacher = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), validators=[validate_teacher_role])
    language = serializers.PrimaryKeyRelatedField(
        queryset=Language.objects.all(), allow_null=True)
    name = serializers.CharField(max_length=255)
    type_of_classes = serializers.PrimaryKeyRelatedField(
        queryset=TypeOfClasses.objects.all())
    difficulty_level = serializers.CharField(max_length=50)
    max_number_of_lessons = serializers.IntegerField(
        required=False, validators=[MinValueValidator(1)])
    active = serializers.BooleanField(default=True)
    price_for_lesson = serializers.DecimalField(max_digits=6, decimal_places=2)
    stationary = serializers.BooleanField(default=False)
    description = serializers.CharField()

    def create(self, validated_data):
        return Class.objects.create(**validated_data)
