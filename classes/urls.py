from django.urls import path
from .views import get_types_of_classes
from .views import get_all_classes, get_languages

urlpatterns = [
    path('', get_all_classes, name="get_all_classes"),
    path('types', get_types_of_classes, name="get_type_of_classes"),
    path('languages', get_languages, name="get_languages"),
    path('classes', get_all_classes, name="get_all_classes"),
]
