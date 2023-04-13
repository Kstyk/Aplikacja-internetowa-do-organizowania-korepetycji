from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.


class CustomUser(AbstractUser):
    username = models.CharField(
        max_length=40,
        unique=True,
        blank=False,
        null=False,
        error_messages={
            'blank': "Pole username jest wymagane",
            'null': "Pole username jest wymagane",
            'unique': "Ta nazwa użytkownika just istnieje w naszej bazie",
        }
    )
    phone_number = models.CharField(max_length=20)
    email = models.EmailField(null=False, blank=False)

    class Meta:
        app_label = "auth_user"
