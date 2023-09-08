from rest_framework import serializers
from .models import Class, Language, Schedule, Timeslot, PurchaseHistory, Opinion
from users.serializers import UserSerializer, UserProfileSerializer
from rooms.serializers import RoomSerializer
from .validators import validate_teacher_role
from django.core.validators import MinValueValidator
from users.models import User, UserDetails


class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = '__all__'


class TimeslotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Timeslot
        fields = '__all__'


class CreateTimeSlotsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Timeslot
        fields = '__all__'


class ClassSerializer(serializers.ModelSerializer):
    # Zaimportowany gotowy serializer dla modelu TypeOfClasses
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


class ScheduleSerializer(serializers.ModelSerializer):
    classes = ClassSerializer()

    class Meta:
        model = Schedule
        fields = '__all__'


class PurchaseClassesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = '__all__'


class PurchaseHistorySerializer(serializers.ModelSerializer):
    classes = ClassSerializer()
    room = RoomSerializer()
    student = UserSerializer()

    class Meta:
        model = PurchaseHistory
        fields = '__all__'


class MostPopularLanguages(serializers.ModelSerializer):
    num_classes = serializers.SerializerMethodField()

    class Meta:
        model = Language
        fields = ['id', 'name', 'slug', 'num_classes']

    def get_num_classes(self, language):
        return language.class_language.count()


class OpinionSerializer(serializers.ModelSerializer):
    student = UserSerializer()
    teacher = UserSerializer()
    student_profile_image = serializers.SerializerMethodField()

    class Meta:
        model = Opinion
        fields = '__all__'

    def get_student_profile_image(self, obj):
        user_profile = UserDetails.objects.get(user=obj.student)

        if user_profile:
            if user_profile.profile_image:
                return user_profile.profile_image.url
            else:
                return None
        else:
            return None


class CreateOpinionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Opinion
        fields = ['student', 'teacher', 'content', 'rate']

    def validate(self, data):
        student = data.get('student')
        teacher = data.get('teacher')

        if Opinion.objects.filter(student=student, teacher=teacher).exists():
            raise serializers.ValidationError({"teacher":
                                               "Możesz dodać tylko jedną opinię dla tego nauczyciela."})

        return data
