from rest_framework import serializers
from .models import Class, Language, Schedule, Timeslot, PurchaseHistory, Opinion, AskClasses
from users.serializers import UserSerializer, UserProfileSerializer, AddressSerializer, CreateOrUpdateAddressSerializer
from rooms.serializers import RoomSerializer
from .validators import validate_teacher_role
from django.core.validators import MinValueValidator
from users.models import User, UserDetails
from django.db.models import Avg
from users.serializers import CitySerializer
from cities_light.models import City
from users.models import Address
from django.db import transaction


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
    address = AddressSerializer()

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
    address = AddressSerializer()

    class Meta:
        model = Class
        fields = '__all__'


class CreateClassSerializer(serializers.ModelSerializer):
    address = CreateOrUpdateAddressSerializer(required=False)
    place_of_classes = serializers.ListField(
        child=serializers.CharField(max_length=150), allow_empty=False, required=True
    )

    class Meta:
        model = Class
        fields = '__all__'

    def create(self, validated_data):
        with transaction.atomic():
            address_data = validated_data.pop('address', None)

            instance = Class.objects.create(**validated_data, address=None)

            if address_data is not None:
                address = Address.objects.create(**address_data)
                instance.address = address

            instance.save()

            return instance


class UpdateClassSerializer(serializers.ModelSerializer):
    place_of_classes = serializers.ListField(
        child=serializers.CharField(max_length=150), allow_empty=False, required=True
    )
    address = CreateOrUpdateAddressSerializer(required=False)

    class Meta:
        model = Class
        fields = ['language', 'name', 'price_for_lesson', 'description',
                  'able_to_buy', 'place_of_classes', 'address']

    def update(self, instance, validated_data):
        address_data = validated_data.pop('address', None)

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

        if address_data is not None and 'teacher_home' in instance.place_of_classes:
            if instance.address is not None:
                address = instance.address
                if address_data.get('city', address.city) is not None:
                    address.city = address_data.get('city', address.city)
                if address_data.get('voivodeship', address.voivodeship) is not None:
                    address.voivodeship = address_data.get(
                        'voivodeship', address.voivodeship)
                if address_data.get('postal_code', address.postal_code) is not None:
                    address.postal_code = address_data.get(
                        'postal_code', address.postal_code)
                if address_data.get('street', address.street) is not None:
                    address.street = address_data.get(
                        'street', address.street)
                if address_data.get('building_number', address.building_number) is not None:
                    address.building_number = address_data.get(
                        'building_number', address.building_number)
                address.save()
            else:
                address = Address.objects.create(**address_data)
                instance.address = address
                instance.save()
        else:
            if instance.address:
                instance.address.delete()
            instance.address = None

        instance.save()
        return instance


class ScheduleSerializer(serializers.ModelSerializer):
    classes = ClassSerializer()
    student = UserSerializer()
    address = AddressSerializer()

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
    address = AddressSerializer()

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
    classes_rated = ClassSerializer()

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
        fields = ['student', 'teacher', 'content', 'rate', 'classes_rated']

    def validate(self, data):
        student = data.get('student')
        teacher = data.get('teacher')
        classes_rated = data.get('classes_rated')

        if classes_rated.teacher.id is not teacher.id:
            raise serializers.ValidationError({"wrong_classes":
                                               "To nie są zajęcia określonego nauczyciela."})

        if Opinion.objects.filter(student=student, teacher=teacher, classes_rated=classes_rated).exists():
            raise serializers.ValidationError({"exist_opinion":
                                               "Możesz dodać tylko jedną opinię dla tego nauczyciela dotyczącą tych zajęć."})

        return data


class UpdateOpinionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Opinion
        fields = ['teacher', 'classes_rated', 'rate', 'content']

    def validate(self, data):
        edited_opinion_id = self.context['view'].kwargs.get('pk')
        student = self.context['request'].user
        teacher = data.get('teacher')
        classes_rated = data.get('classes_rated')

        if classes_rated.teacher.id is not teacher.id:
            raise serializers.ValidationError({"wrong_classes":
                                               "To nie są zajęcia określonego nauczyciela."})

        op = Opinion.objects.filter(
            student=student, teacher=teacher, classes_rated=classes_rated).exclude(pk=edited_opinion_id)
        if op.exists():
            raise serializers.ValidationError({"exist_opinion":
                                               "Możesz dodać tylko jedną opinię dla tego nauczyciela dotyczącą tych zajęć."})

        return data


class CreateOrUpdateAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'


class AskClassesListSerializer(serializers.ModelSerializer):
    classes = ClassSerializer()
    student = UserSerializer()
    address = AddressSerializer()
    student_profile_image = serializers.SerializerMethodField()

    class Meta:
        model = AskClasses
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


class AskClassesCreateSerializer(serializers.ModelSerializer):
    address = CreateOrUpdateAddressSerializer(required=True)

    class Meta:
        model = AskClasses
        fields = ['address', 'student_message', 'student', 'classes']

    def create(self, validated_data):
        address_data = validated_data.pop('address', None)
        askclasses = AskClasses.objects.create(**validated_data)

        address = Address.objects.create(
            askclasses=askclasses, **address_data)
        askclasses.address = address

        askclasses.save()

        return askclasses


class ResponseAskClassesSerializer(serializers.ModelSerializer):
    class Meta:
        model = AskClasses
        fields = ['id', 'teacher_message', 'accepted']

    def validate_teacher_message(self, value):
        if value is None or value.strip() == "":
            raise serializers.ValidationError(
                "Musisz napisać wiadomość argumentującą daną odpowiedź.")
        return value

    def validate_accepted(self, value):
        if value is None:
            raise serializers.ValidationError(
                "Musisz określić status zapytania.")
        return value
