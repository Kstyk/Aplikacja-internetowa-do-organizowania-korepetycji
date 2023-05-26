from django.db import models
from users.models import User
from django.core.validators import MinValueValidator
from .validators import validate_teacher_role
# Create your models here.


class TypeOfClasses(models.Model):
    type = models.CharField(null=False, blank=False, max_length=50)

    def __str__(self):
        return self.type


class Language(models.Model):
    name = models.CharField(null=False, blank=False, max_length=255)

    def __str__(self):
        return self.name


class Class(models.Model):
    teacher = models.ForeignKey(
        User, on_delete=models.CASCADE, validators=[validate_teacher_role])
    language = models.ForeignKey(
        Language, on_delete=models.PROTECT, null=True
    )
    name = models.CharField(max_length=255, null=False, blank=False)
    type_of_classes = models.ForeignKey(
        TypeOfClasses, on_delete=models.PROTECT)
    difficulty_level = models.CharField(null=False, blank=False, max_length=50)
    max_number_of_lessons = models.IntegerField(
        null=True, blank=True, validators=[MinValueValidator(1)])  # jeśli cotygodniowo
    active = models.BooleanField(default=True)
    price_for_lesson = models.DecimalField(max_digits=6, decimal_places=2)
    stationary = models.BooleanField(default=False)
    description = models.TextField()

    def __str__(self):
        return self.name
