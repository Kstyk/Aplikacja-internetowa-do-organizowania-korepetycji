from django.shortcuts import render
from .models import TypeOfClasses, Class, Language, Schedule
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from .serializers import TypeOfClassesSerializer, ClassSerializer, LanguageSerializer, CreateClassSerializer, CreateScheduleSerializer, ScheduleSerializer
from rest_framework.response import Response
from rest_framework import status, generics
from django.db.models import Q
from django.db import IntegrityError, transaction
from .paginators import ClassPagination
from users.permissions import IsTeacher
# Create your views here.


@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def get_types_of_classes(request):
    types = TypeOfClasses.objects.all()
    serializer = TypeOfClassesSerializer(types, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_languages(request):
    languages = Language.objects.all()
    serializer = LanguageSerializer(languages, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_all_classes(request):
    search_text = request.GET.get('search_text')
    difficulty_level = request.GET.get('difficulty_level')
    min_price = request.GET.get('min_price')
    max_price = request.GET.get('max_price')
    stationary = request.GET.get('stationary')
    language_id = request.GET.get('language')
    classes = Class.objects.filter(able_to_buy=True)

    if search_text is not None:
        classes = classes.filter(Q(name__icontains=search_text) | Q(
            description__icontains=search_text))
    if difficulty_level is not None:
        classes = classes.filter(difficulty_level=difficulty_level)
    if language_id is not None:
        classes = classes.filter(language_id=language_id)
    if min_price is not None:
        classes = classes.filter(price_for_lesson__gte=min_price)
    if max_price is not None:
        classes = classes.filter(price_for_lesson__lte=max_price)
    if stationary is not None:
        classes = classes.filter(stationary=stationary)

    if len(classes) > 0:

        paginator = ClassPagination()
        result_page = paginator.paginate_queryset(classes, request=request)
        serializer = ClassSerializer(result_page, many=True)

        result_dict = {
            'page_number': paginator.page.number,
            'total_pages': paginator.page.paginator.num_pages,
            'total_classes': paginator.page.paginator.count,
            'classes': serializer.data,
        }

        return Response(result_dict)
    else:
        return Response({}, status=status.HTTP_200_OK)


# @api_view(['POST'])
# def create_class(request):
#     print(request.user.id)
#     # return Response(status=status.HTTP_200_OK)
#     classesData = request.data
#     classesData['teacher'] = request.user.id
#     serializer = CreateClassSerializer(data=classesData)
#     if serializer.is_valid():
#         serializer.save()
#         return Response({'success': 'Klasa została utworzona'}, status=status.HTTP_201_CREATED)
#     else:
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ClassCreateView(generics.CreateAPIView):
    serializer_class = CreateClassSerializer
    queryset = Class.objects.all()

    def post(self, request):
        data = request.data
        data["teacher"] = request.user.id
        serializer = self.get_serializer(
            data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'success': 'Klasa została utworzona'}, status=status.HTTP_201_CREATED)


class ScheduleCreateView(generics.ListCreateAPIView):
    queryset = Schedule.objects.all()
    serializer_class = CreateScheduleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Schedule.objects.filter(teacher=self.request.user)

    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)

    def create(self, request, *args, **kwargs):
        with transaction.atomic():
            if isinstance(request.data, list):
                serializer = self.get_serializer(data=request.data, many=True)
            else:
                serializer = self.get_serializer(data=request.data)
            try:
                serializer.is_valid(raise_exception=True)
                self.perform_create(serializer)
                headers = self.get_success_headers(serializer.data)
                return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
            except IntegrityError as e:
                return Response({"error": "Jedna lub więcej dat jest już wpisana do Twojego harmonogramu godzin."}, status=status.HTTP_409_CONFLICT)


class ScheduleTeacherView(generics.ListAPIView):
    serializer_class = ScheduleSerializer

    def get_queryset(self):
        teacher_id = self.kwargs.get('teacher_id')
        return Schedule.objects.filter(teacher_id=teacher_id)
