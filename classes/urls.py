from django.urls import path
from .views import get_all_classes, get_languages, get_top_languages, get_types_of_classes, ClassCreateView, ScheduleCreateView, ScheduleTeacherView

urlpatterns = [
    path('', get_all_classes, name="get_all_classes"),
    path('types/', get_types_of_classes, name="get_type_of_classes"),
    path('languages/', get_languages, name="get_languages"),
    path('languages/most-popular/', get_top_languages,
         name="get_popular_languages"),
    path('create/', ClassCreateView.as_view(), name="create_class"),
    path('schedule/create/',
         ScheduleCreateView.as_view()),
    path('<int:teacher_id>/schedule/', ScheduleTeacherView.as_view())
]
