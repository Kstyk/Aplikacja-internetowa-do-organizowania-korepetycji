from rest_framework import serializers
from .models import TypeOfClasses, Class, Language
from users.serializers import UserSerializer
from .validators import validate_teacher_role


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
