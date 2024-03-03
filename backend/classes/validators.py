from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from datetime import datetime
from django.utils import timezone
now = timezone.now()


def validate_teacher_role(value):
    User = get_user_model()

    try:
        if type(value) is int:
            user = User.objects.get(pk=value)
        else:
            user = User.objects.get(pk=value.id)
    except User.DoesNotExist:
        raise ValidationError("Użytkownik o podanym ID nie istnieje.")

    if user.role is None:
        raise ValidationError(
            "Użytkownik nie posiada roli 'nauczyciel'.")
    else:
        if user.role.name != "Teacher":
            raise ValidationError(
                "Użytkownik nie posiada roli 'nauczyciel'.")


def validate_student_role(value):
    User = get_user_model()

    try:
        if type(value) is int:
            user = User.objects.get(pk=value)
        else:
            user = User.objects.get(pk=value.id)
    except User.DoesNotExist:
        raise ValidationError("Użytkownik o podanym ID nie istnieje.")

    if user.role is None:
        raise ValidationError(
            "Użytkownik nie posiada roli 'student'.")
    else:
        if user.role.name != "Student":
            raise ValidationError(
                "Użytkownik nie posiada roli 'student'.")


def validate_future_date(value):
    if value <= now:
        raise ValidationError(
            "Możesz kupować zajęcia o dacie późniejszej niż obecna."
        )


def validate_teacher_for_timeslot(teacher, timeslot):
    if teacher != timeslot.teacher:
        raise ValidationError(
            "Selected teacher is not associated with the chosen timeslot.")
