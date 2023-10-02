from django.urls import path
from .views import get_all_classes, get_languages, get_top_languages, ClassCreateView, TimeSlotsCreateView, ScheduleTeacherView, ScheduleStudentView, ClassesByIdView, TimeslotsTeacherView, purchase_classes, PurchaseHistoryList, TeacherOpinionsList, ReceivedOpinionsList, CreateOpinionView, TeacherClassesView, AddedOpinionsList, TeacherPurchaseHistoryList, ClassesBoughtByStudentToRateView
urlpatterns = [
    path('', get_all_classes, name="get_all_classes"),
    path('languages/', get_languages, name="get_languages"),
    path('languages/most-popular/', get_top_languages,
         name="get_popular_languages"),
    path('create/', ClassCreateView.as_view(), name="create_class"),
    path('update/<int:pk>/', ClassCreateView.as_view(), name="update_class"),
    path('teacher-classes/', TeacherClassesView.as_view()),
    path('timeslots/create/',
         TimeSlotsCreateView.as_view()),
    path('<int:teacher_id>/timeslots/', TimeslotsTeacherView.as_view()),
    path('<int:teacher_id>/schedule/', ScheduleTeacherView.as_view()),
    path('<int:student_id>/student-schedule/', ScheduleStudentView.as_view()),
    path('purchase_classes/', purchase_classes, name="purchase_classes"),
    path('purchase-classes/history/', PurchaseHistoryList.as_view(),
         name="purchase_classes_history"),
    path('purchase-classes/teacher-history/', TeacherPurchaseHistoryList.as_view(),
         name="purchase_classes_teacher_history"),
    path('purchase-classes/classes-bought-by-student-teacher/<int:teacher_id>/',
         ClassesBoughtByStudentToRateView.as_view()),
    path('<int:pk>/', ClassesByIdView.as_view()),
    path('<int:teacher_id>/opinions/', TeacherOpinionsList.as_view()),
    path('my-opinions/', ReceivedOpinionsList.as_view()),
    path('added-opinions/', AddedOpinionsList.as_view()),
    path('add-opinion/', CreateOpinionView.as_view()),

]
