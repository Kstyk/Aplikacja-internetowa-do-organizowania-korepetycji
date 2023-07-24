from rest_framework import serializers
from .models import Role, Address, UserDetails
from django.contrib.auth import get_user_model
from rest_framework.validators import UniqueValidator
from classes.models import Language
from django.core.exceptions import ValidationError

User = get_user_model()


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


class CreateUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.PrimaryKeyRelatedField(
        queryset=Role.objects.all(), required=True)

    class Meta:
        model = get_user_model()
        fields = ['email', 'password', 'first_name', 'last_name', 'role']
        extra_kwargs = {
            'email': {'error_messages': {'invalid': 'Podaj poprawny adres e-mail.',
                                         'blank': 'Pole "e-mail" nie może być puste.',
                                         'max_length': 'Adres e-mail może mieć maksymalnie 50 znaków.'}},
            'first_name': {'error_messages': {'blank': 'Pole "Imię" nie może być puste.',
                                              'max_length': 'Imię może mieć maksymalnie 50 znaków.'}},
            'last_name': {'error_messages': {'blank': 'Pole "Nazwisko" nie może być puste.',
                                             'max_length': 'Nazwisko może mieć maksymalnie 50 znaków.'}}
        }

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


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'


class CreateOrUpdateUserDetailsSerializer(serializers.ModelSerializer):
    address = AddressSerializer(required=False)

    class Meta:
        model = UserDetails
        fields = '__all__'

    def create(self, validated_data):
        address_data = validated_data.pop('address', None)
        known_languages_data = validated_data.pop('known_languages', [])

        userdetails = UserDetails.objects.create(**validated_data)

        for language_data in known_languages_data:
            language = Language.objects.get(pk=language_data.id)
            userdetails.known_languages.add(language)

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
            if field != "known_languages":
                setattr(instance, field, validated_data[field])
            else:
                instance.known_languages.set(validated_data[field])

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
                address.save()
            else:
                address = Address.objects.create(
                    userdetails=instance, **address_data)
                instance.address = address
                instance.save()

        instance.save()

        return instance
