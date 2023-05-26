from django.core.exceptions import ValidationError


def validate_teacher_role(value):
    if value is None or value.name != "Teacher":
        raise ValidationError(
            "Tylko rola 'nauczyciel' może być przypisana do zajęć.")
