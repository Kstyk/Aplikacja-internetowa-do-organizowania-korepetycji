from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from classes.models import Language
from multiselectfield import MultiSelectField
from cities_light.models import City, Region
from django.core.validators import MinLengthValidator
# Create your models here.


class Role(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class CustUserManager(BaseUserManager):
    def create_superuser(self, email, password):

        if password is None:
            raise TypeError('Superusers must have a password.')

        user = self.model(
            email=self.normalize_email(email)
        )
        user.set_password(password)
        user.is_superuser = True
        user.is_staff = True
        user.save()

        return user

    def create_user(self, email, password, first_name, last_name, role):

        if email is None:
            raise TypeError('Users must have an email address.')

        user = self.model(
            email=self.normalize_email(email),
            first_name=first_name,
            last_name=last_name,
            role=role
        )
        user.set_password(password)
        user.save()

        return user


class User(AbstractUser):
    email = models.EmailField(unique=True, blank=False,
                              null=False, max_length=50, error_messages={
                                  'unique': 'Użytkownik o podanym adresie e-mail już istnieje.',
                              })
    first_name = models.CharField(
        max_length=50, blank=False, null=False, validators=[MinLengthValidator(2)])
    last_name = models.CharField(
        max_length=50, blank=False, null=False, validators=[MinLengthValidator(2)])
    role = models.ForeignKey(
        Role, on_delete=models.CASCADE, null=True, blank=True)
    username = None

    objects = CustUserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return f"{self.first_name} {self.last_name} {self.email}"


class Address(models.Model):
    voivodeship = models.ForeignKey(
        Region,
        on_delete=models.CASCADE,
        limit_choices_to={'country__name': 'Poland'},
    )
    city = models.ForeignKey(
        City,
        on_delete=models.CASCADE,
        limit_choices_to={'country__name': 'Poland'},
    )
    postal_code = models.CharField(max_length=6)
    street = models.CharField(max_length=50, null=True, blank=True)
    building_number = models.CharField(max_length=10, null=True, blank=True)

    def __str__(self) -> str:
        return f"{self.voivodeship.name} - {self.city.name} - {self.postal_code} {self.street}, {self.building_number}"


TEACHER_HOME = 'teacher_home'
STUDENT_HOME = 'student_home'
ONLINE = 'online'

LOCATION_CHOICES = [
    (TEACHER_HOME, 'U nauczyciela'),
    (STUDENT_HOME, 'U ucznia'),
    (ONLINE, 'Online'),
]


class UserDetails(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, null=False, blank=False
    )
    profile_image = models.ImageField(
        upload_to='images/profile_images', null=True, blank=True)
    description = models.TextField(blank=True, null=True)
    year_of_birth = models.IntegerField(
        blank=True, null=True)
    phone_number = models.CharField(
        blank=True, null=True, max_length=20, unique=True, error_messages={
            'unique': 'Użytkownik o podanym numerze telefonu już istnieje.',
        })
    known_languages = models.ManyToManyField(
        Language, blank=True, related_name='known_languages')
    sex = models.CharField(null=True, blank=True, choices={(
        "mężczyzna", "mężczyzna"), ("kobieta", "kobieta")}, max_length=20)
    place_of_classes = MultiSelectField(
        choices=LOCATION_CHOICES, null=True, blank=True, max_choices=3, max_length=150)
    cities_of_work = models.ManyToManyField(
        City, related_name="cities_of_work", null=True, blank=True)
    experience = models.CharField(null=True, blank=True, max_length=10000)
    address = models.ForeignKey(
        Address, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return f"{self.user.email} - {self.user.first_name} {self.user.last_name}"
