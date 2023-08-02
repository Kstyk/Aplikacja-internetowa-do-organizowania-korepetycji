from django.db import models
from django.core.validators import MinValueValidator
from .validators import validate_teacher_role, validate_future_date
from autoslug import AutoSlugField
# Create your models here.


class TypeOfClasses(models.Model):
    type = models.CharField(null=False, blank=False, max_length=50)

    def __str__(self):
        return self.type


class Language(models.Model):
    name = models.CharField(null=False, blank=False, max_length=255)
    slug = AutoSlugField(populate_from='name', null=True)

    def __str__(self):
        return self.name


class Class(models.Model):
    teacher = models.ForeignKey(
        'users.User', on_delete=models.CASCADE, validators=[validate_teacher_role])
    language = models.ForeignKey(
        Language, on_delete=models.PROTECT, null=True, related_name="class_language"
    )
    name = models.CharField(max_length=255, null=False, blank=False)
    type_of_classes = models.ForeignKey(
        TypeOfClasses, on_delete=models.PROTECT)
    difficulty_level = models.CharField(null=False, blank=False, max_length=50)
    active = models.BooleanField(default=True)
    price_for_lesson = models.DecimalField(max_digits=6, decimal_places=2)
    description = models.TextField()
    able_to_buy = models.BooleanField(default=True, null=True, blank=True)

    def __str__(self):
        return self.name


class Schedule(models.Model):
    class Meta:
        unique_together = ('teacher', 'date', 'timeslot')

    TIMESLOT_LIST = (
        (0, '09:00 – 10:00'),
        (1, '10:00 – 11:00'),
        (2, '11:00 – 12:00'),
        (3, '12:00 – 13:00'),
        (4, '13:00 – 14:00'),
        (5, '14:00 – 15:00'),
        (6, '15:00 – 16:00'),
        (7, '16:00 – 17:00'),
        (8, '17:00 – 18:00'),
        (9, '18:00 – 19:00'),
    )

    teacher = models.ForeignKey(
        'users.User', on_delete=models.CASCADE, related_name="teacher", validators=[validate_teacher_role]
    )
    date = models.DateField(help_text="YYYY-MM-DD",
                            validators=[validate_future_date])
    timeslot = models.IntegerField(choices=TIMESLOT_LIST)
    student = models.ForeignKey(
        "users.User", on_delete=models.CASCADE, null=True, blank=True, related_name="student"
    )
    classes = models.ForeignKey(
        Class, on_delete=models.CASCADE, related_name="classes", null=True, blank=True
    )

    def __str__(self):
        return '{} {} {}'.format(self.date, self.time, self.teacher)
