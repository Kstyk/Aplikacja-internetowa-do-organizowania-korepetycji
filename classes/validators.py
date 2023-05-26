from django.core.exceptions import ValidationError


def validate_teacher_role(value):
    if value.role is None:
        raise ValidationError(
            "Tylko rola 'nauczyciel' może być przypisana do zajęć.")
    else:
        if value.role.name != "Teacher":
            raise ValidationError(
                "Tylko rola 'nauczyciel' może być przypisana do zajęć.")
