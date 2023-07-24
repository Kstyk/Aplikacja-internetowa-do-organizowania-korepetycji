from django.urls import path
from .views import UserRegistrationView, RolesListView, UsersListView, TeachersListView, UserDetailsCreateView, UserDetailsUpdateView

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name="user_registration"),
    path('roles/', RolesListView.as_view(), name="all_roles"),
    path('', UsersListView.as_view(), name="all_users"),
    path('teachers/', TeachersListView.as_view()),
    path('add-informations/', UserDetailsCreateView.as_view()),
    path('profile/<pk>/edit-informations/', UserDetailsUpdateView.as_view())
]
