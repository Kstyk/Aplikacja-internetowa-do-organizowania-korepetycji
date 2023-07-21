from django.urls import path
from .views import UserRegistrationView, RolesListView, UsersListView, TeachersListView

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name="user_registration"),
    path('roles/', RolesListView.as_view(), name="all_roles"),
    path('', UsersListView.as_view(), name="all_users"),
    path('teachers/', TeachersListView.as_view()),
]
