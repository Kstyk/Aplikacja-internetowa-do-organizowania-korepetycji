from rest_framework import serializers
from .models import Class, Language, Schedule, Timeslot, PurchaseHistory, Opinion
from users.serializers import UserSerializer, UserProfileSerializer
from rooms.serializers import RoomSerializer
from .validators import validate_teacher_role
from django.core.validators import MinValueValidator
from users.models import User, UserDetails
from django.db.models import Avg


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
    average_rate = serializers.SerializerMethodField()
    amount_of_opinions = serializers.SerializerMethodField()

    class Meta:
        model = Class
        fields = '__all__'

    def validate_teacher_id(self, value):
        validate_teacher_role(value)
        return value

    def get_average_rate(self, obj):
        opinions = Opinion.objects.filter(teacher=obj.teacher)

        average_rate = opinions.aggregate(Avg('rate'))['rate__avg']

        if average_rate is not None:
            return average_rate
        else:
            return None

    def get_amount_of_opinions(self, obj):
        opinions = Opinion.objects.filter(teacher=obj.teacher)

        return len(opinions)


class CreateClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = '__all__'

    def create(self, validated_data):
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
            raise serializers.ValidationError({"exist_opinion":
                                               "Możesz dodać tylko jedną opinię dla tego nauczyciela."})

        return data
