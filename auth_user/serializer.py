from django.contrib.auth import get_user_model
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        User = get_user_model()
        model = User
        fields = ('id', 'username', 'password', 'email',
                  'first_name', 'last_name', 'phone_number')
        extra_kwargs = {'password': {'write_only': True, 'required': False},
                        'username': {"error_messages": {"max_length": ("Twoja nazwa uzytkownika nie może być dłuższa niż 40 znaków")}}
                        }

    def create(self, validated_data):
        User = get_user_model()
        user = User.objects.create_user(**validated_data)
        return user
