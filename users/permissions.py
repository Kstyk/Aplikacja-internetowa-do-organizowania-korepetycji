from rest_framework.permissions import BasePermission


class IsStudent(BasePermission):
    message = 'Nie jesteś uczniem - nie możesz wykonać tej operacji'

    def has_permission(self, request, view):
        if request.user.is_authenticated:
            print(request.user.role.name)
            return request.user.role.name == 'Student'
        return False
