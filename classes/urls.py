from django.urls import path
from .views import get_all_classes, get_languages, get_top_languages, ClassCreateView, ScheduleCreateView, ScheduleTeacherView, ClassesByIdView, TimeslotsTeacherView

urlpatterns = [
    path('', get_all_classes, name="get_all_classes"),
    path('languages/', get_languages, name="get_languages"),
    path('languages/most-popular/', get_top_languages,
         name="get_popular_languages"),
    path('create/', ClassCreateView.as_view(), name="create_class"),
    path('schedule/create/',
         ScheduleCreateView.as_view()),
    path('<int:teacher_id>/timeslots/', TimeslotsTeacherView.as_view()),
    path('<int:teacher_id>/schedule/', ScheduleTeacherView.as_view()),
    path('<int:pk>/', ClassesByIdView.as_view()),

]
