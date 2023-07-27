from rest_framework.permissions import BasePermission


class IsStudent(BasePermission):
    message = 'Nie jesteś uczniem - nie możesz wykonać tej operacji'

    def has_permission(self, request, view):
        if request.user.is_authenticated:
            print(request.user.role.name)
            return request.user.role.name == 'Student'
        return False


class IsTeacher(BasePermission):
    message = 'Nie jesteś nauczycielem - nie możesz wykonać tej operacji'

    def has_permission(self, request, view):
        if request.user.is_authenticated:
            print(request.user.role.name)
            return request.user.role.name == 'Teacher'
        return False


class IsOwnerProfile(BasePermission):
    message = 'To nie jest twój profil - nie możesz go edytować'

    def has_object_permission(self, request, view, obj):
        return obj.user == request.user
