from rest_framework import serializers
from .models import Role
from django.contrib.auth import get_user_model
from rest_framework.validators import UniqueValidator
from django.core.exceptions import ValidationError


User = get_user_model()


class RoleSerializer(serializers.ModelSerializer):
    value = serializers.IntegerField(source='id')
    label = serializers.CharField(source='name')

    class Meta:
        model = Role
        fields = ('value', 'label')


class UserSerializer(serializers.ModelSerializer):
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
