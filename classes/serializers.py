from rest_framework import serializers
from .models import Class, Language, Schedule, Timeslot, PurchaseHistory, Opinion
from users.serializers import UserSerializer, UserProfileSerializer
from rooms.serializers import RoomSerializer
from .validators import validate_teacher_role
from django.core.validators import MinValueValidator
from users.models import User, UserDetails
from django.db.models import Avg
from users.serializers import CitySerializer
from cities_light.models import City


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
    language = LanguageSerializer()
    teacher = UserProfileSerializer(source='teacher.userdetails')
    average_rate = serializers.SerializerMethodField()
    amount_of_opinions = serializers.SerializerMethodField()
    cities_of_classes = CitySerializer(many=True)

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


class ClassTeacherViewSerializer(serializers.ModelSerializer):
    language = LanguageSerializer()
    cities_of_classes = CitySerializer(many=True)

    class Meta:
        model = Class
        fields = '__all__'


class CreateClassSerializer(serializers.ModelSerializer):
    place_of_classes = serializers.ListField(
        child=serializers.CharField(max_length=150), allow_empty=False, required=True
    )

    class Meta:
        model = Class
        fields = '__all__'

    def create(self, validated_data):
        cities_data = validated_data.pop('cities_of_classes', [])

        instance = Class.objects.create(**validated_data)

        instance.cities_of_classes.set(cities_data)

        return instance


class UpdateClassSerializer(serializers.ModelSerializer):
    place_of_classes = serializers.ListField(
        child=serializers.CharField(max_length=150), allow_empty=False, required=True
    )

    class Meta:
        model = Class
        fields = ['language', 'name', 'price_for_lesson', 'description',
                  'able_to_buy', 'place_of_classes', 'cities_of_classes']

    def update(self, instance, validated_data):
        cities_data = validated_data.pop('cities_of_classes', [])

        instance.name = validated_data.get('name', instance.name)
        instance.language = validated_data.get(
            'language', instance.language)
        instance.description = validated_data.get(
            'description', instance.description)
        instance.price_for_lesson = validated_data.get(
            'price_for_lesson', instance.price_for_lesson)
        instance.description = validated_data.get(
            'description', instance.description)
        instance.able_to_buy = validated_data.get(
            'able_to_buy', instance.able_to_buy)
        instance.place_of_classes = validated_data.get(
            'place_of_classes', instance.place_of_classes)
        instance.cities_of_classes.set(cities_data)

        instance.save()
        return instance


class ScheduleSerializer(serializers.ModelSerializer):
    classes = ClassSerializer()
    city_of_classes = CitySerializer()
    student = UserSerializer()

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
    city_of_classes = CitySerializer()

    class Meta:
        model = PurchaseHistory
        fields = '__all__'


class PurchaseHistoryLightSerializer(serializers.ModelSerializer):
    classes = ClassSerializer()
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
    teacher_profile_image = serializers.SerializerMethodField()

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

    def get_teacher_profile_image(self, obj):
        user_profile = UserDetails.objects.get(user=obj.teacher)

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
