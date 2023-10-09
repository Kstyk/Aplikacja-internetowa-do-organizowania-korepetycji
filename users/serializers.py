from rest_framework import serializers, fields
from .models import Role, Address, UserDetails, PrivateMessage
from django.contrib.auth import get_user_model
from rest_framework.validators import UniqueValidator
from classes.models import Language
from django.core.exceptions import ValidationError
from .models import LOCATION_CHOICES
from cities_light.models import City, Region

User = get_user_model()


class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = '__all__'


class RoleSerializer(serializers.ModelSerializer):
    value = serializers.IntegerField(source='id')
    label = serializers.CharField(source='name')

    class Meta:
        model = Role
        fields = ('value', 'label')


class UserSerializer(serializers.ModelSerializer):
    role = RoleSerializer()

    class Meta:
        model = get_user_model()
        fields = ['id', 'email', 'first_name', 'last_name', 'role']


class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['first_name', 'last_name']


class CreateUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    role = serializers.PrimaryKeyRelatedField(
        queryset=Role.objects.all(), required=True)

    class Meta:
        model = get_user_model()
        fields = ['email', 'password', 'confirm_password',
                  'first_name', 'last_name', 'role']

    def validate(self, data):
        password = data.get('password')
        confirm_password = data.get('confirm_password')

        if password and confirm_password and password != confirm_password:
            raise ValidationError(
                {"confirm_password": "Hasła nie są identyczne."})

        return data

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            role=validated_data['role'],
        )

        user.set_password(validated_data['password'])

        user.save()

        return user


class CitySerializer(serializers.ModelSerializer):
    region_name = serializers.SerializerMethodField()

    class Meta:
        model = City
        fields = ['id', 'slug', 'name',
                  'region_id', 'region_name']

    def get_region_name(self, obj):
        return obj.region.name


class VoivodeshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = '__all__'


class AddressSerializer(serializers.ModelSerializer):
    city = CitySerializer()
    voivodeship = VoivodeshipSerializer()

    class Meta:
        model = Address
        fields = '__all__'


class CreateOrUpdateAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'


class CreateOrUpdateUserDetailsSerializer(serializers.ModelSerializer):
    place_of_classes = fields.MultipleChoiceField(
        choices=LOCATION_CHOICES, required=False)
    address = CreateOrUpdateAddressSerializer(required=False)

    class Meta:
        model = UserDetails
        fields = '__all__'

    def create(self, validated_data):
        address_data = validated_data.pop('address', None)
        known_languages_data = validated_data.pop('known_languages', [])
        cities_of_work = validated_data.pop('cities_of_work', [])

        userdetails = UserDetails.objects.create(**validated_data)

        for language_data in known_languages_data:
            language = Language.objects.get(pk=language_data.id)
            userdetails.known_languages.add(language)

        for city_data in cities_of_work:
            city = City.objects.get(pk=city_data.id)
            userdetails.cities_of_work.add(city)

        if validated_data.get('address'):
            address = Address.objects.create(
                userdetails=userdetails, **address_data)
            userdetails.address = address

        userdetails.save()

        return userdetails

    def update(self, instance, validated_data):
        address_data = validated_data.pop('address', None)

        fields = validated_data.keys()
        for field in fields:
            if field == "known_languages":
                instance.known_languages.set(validated_data[field])
            elif field == "cities_of_work":
                instance.cities_of_work.set(validated_data[field])
            else:
                setattr(instance, field, validated_data[field])

        if address_data is not None:
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
                address = Address.objects.create(
                    userdetails=instance, **address_data)
                instance.address = address
                instance.save()

        instance.save()

        return instance


class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    address = AddressSerializer()
    cities_of_work = CitySerializer(many=True)
    known_languages = LanguageSerializer(many=True)

    class Meta:
        model = UserDetails
        fields = '__all__'


class MostPopularCitySerializer(serializers.ModelSerializer):
    num_tutors = serializers.SerializerMethodField()

    class Meta:
        model = City
        fields = ['id', 'slug', 'name',
                  'search_names', 'region_id', 'num_tutors']

    def get_num_tutors(self, city):
        return city.cities_of_work.count()


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_new_password = serializers.CharField(required=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_new_password']:
            raise serializers.ValidationError(
                {"confirm_new_password": "Nowe hasła nie pasują do siebie."})
        return data


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()


class CreatePrivateMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrivateMessage
        fields = (
            "to_user",
            "content",
        )
        extra_kwargs = {'content': {'error_messages': {
            'blank': 'Treść wiadomości nie może być pusta.'}}}

    def validate(self, data):
        from_user = self.context['request'].user
        to_user = data.get('to_user')

        if from_user == to_user:
            raise serializers.ValidationError({"error":
                                               "Nie można wysyłać wiadomości do siebie."})
        return data


class UserPrivateMessageSerializer(serializers.ModelSerializer):
    role = RoleSerializer()
    profile_image = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'email', 'first_name',
                  'last_name', 'role', 'profile_image')

    def get_profile_image(self, obj):
        if obj.userdetails:
            if obj.userdetails.profile_image:
                return obj.userdetails.profile_image.url
            else:
                return None
        else:
            return None


class PrivateMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrivateMessage
        fields = (
            "id",
            "from_user",
            "to_user",
            "content",
            "timestamp",
            "read"
        )
