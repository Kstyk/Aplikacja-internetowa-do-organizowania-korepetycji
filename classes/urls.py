from django.urls import path
from .views import get_types_of_classes
from .views import get_all_classes, get_languages, create_class

urlpatterns = [
    path('', get_all_classes, name="get_all_classes"),
    path('types/', get_types_of_classes, name="get_type_of_classes"),
    path('languages/', get_languages, name="get_languages"),
    path('create/', create_class, name="create_class"),
]
