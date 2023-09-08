from django.urls import path
from .views import get_all_classes, get_languages, get_top_languages, ClassCreateView, TimeSlotsCreateView, ScheduleTeacherView, ClassesByIdView, TimeslotsTeacherView, purchase_classes, PurchaseHistoryList, TeacherOpinionsList, ReceivedOpinionsList, CreateOpinionView
urlpatterns = [
    path('', get_all_classes, name="get_all_classes"),
    path('languages/', get_languages, name="get_languages"),
    path('languages/most-popular/', get_top_languages,
         name="get_popular_languages"),
    path('create/', ClassCreateView.as_view(), name="create_class"),
    path('<int:teacher_id>/timeslots/create/',
         TimeSlotsCreateView.as_view()),
    path('<int:teacher_id>/timeslots/', TimeslotsTeacherView.as_view()),
    path('<int:teacher_id>/schedule/', ScheduleTeacherView.as_view()),
    path('purchase_classes/', purchase_classes, name="purchase_classes"),
    path('purchase-classes/history/', PurchaseHistoryList.as_view(),
         name="purchase_classes_history"),
    path('<int:pk>/', ClassesByIdView.as_view()),
    path('<int:teacher_id>/opinions/', TeacherOpinionsList.as_view()),
    path('my-opinions/', ReceivedOpinionsList.as_view()),
    path('add-opinion/', CreateOpinionView.as_view()),

]
