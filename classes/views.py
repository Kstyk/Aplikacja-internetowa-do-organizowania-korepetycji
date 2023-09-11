from django.shortcuts import render
from .models import Class, Language, Schedule, Timeslot, PurchaseHistory, Opinion
from rooms.models import Room
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from .serializers import ClassSerializer, LanguageSerializer, CreateClassSerializer, ScheduleSerializer, MostPopularLanguages, TimeslotSerializer, CreateTimeSlotsSerializer, PurchaseClassesSerializer, PurchaseHistorySerializer, OpinionSerializer, CreateOpinionSerializer
from rest_framework.response import Response
from rest_framework import status, generics
from django.db.models import Q, F
from django.db import IntegrityError, transaction
from .paginators import ClassPagination, PurchaseHistoryPagination, OpinionPagination
from users.permissions import IsTeacher, IsStudent
from django.db.models import Count
from cities_light.models import City, Region
from users.models import UserDetails, User
from datetime import datetime
from rest_framework.serializers import ValidationError
import uuid
from django.db import IntegrityError
from django.db.models import Avg

# Create your views here.


@api_view(['GET'])
def get_languages(request):
    languages = Language.objects.all()
    serializer = LanguageSerializer(languages, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_all_classes(request):
    # filtrowanie
    search_text = request.GET.get('search_text')
    difficulty_level = request.GET.get('difficulty_level')
    min_price = request.GET.get('min_price')
    max_price = request.GET.get('max_price')
    language = request.GET.get('language')
    city_id = request.GET.get('city')
    voivodeship_id = request.GET.get('voivodeship')
    teacher_id = request.GET.get('teacher')
    classes = Class.objects.filter(able_to_buy=True)

    # sortowanie
    sort_by = request.GET.get('sort_by')  # Column name for sorting
    sort_direction = request.GET.get('sort_direction', 'DESC')

    if teacher_id is not None:
        classes = classes.filter(teacher__id=teacher_id)
    if search_text is not None:
        classes = classes.filter(Q(name__icontains=search_text) | Q(
            description__icontains=search_text))
    if difficulty_level is not None:
        classes = classes.filter(difficulty_level=difficulty_level)
    if language is not None:
        classes = classes.filter(language__slug=language)
    if voivodeship_id is not None:
        voivodeship = Region.objects.get(pk=voivodeship_id)

        classes = classes.filter(Q(
            teacher__userdetails__address__voivodeship=voivodeship) | Q(teacher__userdetails__cities_of_work__region=voivodeship))
    if city_id is not None:
        city = City.objects.get(pk=city_id)
        tutors = User.objects.filter(userdetails__cities_of_work=city)
        classes = classes.filter(Q(teacher__in=tutors) | Q(
            teacher__userdetails__address__city=city))

    if min_price is not None:
        classes = classes.filter(price_for_lesson__gte=min_price)
    if max_price is not None:
        classes = classes.filter(price_for_lesson__lte=max_price)

    if sort_by is not None:
        if sort_direction == 'DESC':
            classes = classes.order_by(F(sort_by).desc())
        elif sort_direction == 'ASC':
            classes = classes.order_by(F(sort_by).asc())
        else:
            pass

    if len(classes) > 0:

        paginator = ClassPagination()
        result_page = paginator.paginate_queryset(
            classes.distinct(), request=request)
        serializer = ClassSerializer(result_page, many=True)

        result_dict = {
            'page_number': paginator.page.number,
            'total_pages': paginator.page.paginator.num_pages,
            'total_classes': paginator.page.paginator.count,
            'prev': paginator.get_previous_link(),
            'next': paginator.get_next_link(),
            'classes': serializer.data,
        }

        return Response(result_dict)
    else:
        return Response({}, status=status.HTTP_200_OK)


class ClassesByIdView(generics.RetrieveAPIView):
    serializer_class = ClassSerializer
    queryset = Class.objects.all()
    lookup_field = 'pk'


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


class TimeSlotsCreateView(generics.ListCreateAPIView):
    serializer_class = CreateTimeSlotsSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        data = request.data
        many = isinstance(data, list)

        serializer = self.get_serializer(data=data, many=many)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response(serializer.data)


class ScheduleTeacherView(generics.ListAPIView):
    serializer_class = ScheduleSerializer

    def get_queryset(self):
        teacher_id = self.kwargs.get('teacher_id')
        return Schedule.objects.filter(classes__teacher_id=teacher_id)


class TimeslotsTeacherView(generics.ListAPIView):
    serializer_class = TimeslotSerializer

    def get_queryset(self):
        teacher_id = self.kwargs.get('teacher_id')
        return Timeslot.objects.filter(teacher_id=teacher_id)


@api_view(['GET'])
def get_top_languages(request):
    top_languages = Language.objects.annotate(num_classes=Count(
        'class_language')).order_by('-num_classes')[:20]

    language_serializer = MostPopularLanguages(top_languages, many=True)

    return Response(language_serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsStudent])
def purchase_classes(request):
    selected_slots = request.data.get('selected_slots', [])
    student = request.user
    classes_id = request.data.get('classes_id', [])
    place = request.data.get('place_of_classes')

    try:
        with transaction.atomic():  # Rozpoczęcie transakcji
            if len(selected_slots) == 0:
                raise ValidationError(
                    "Nie wybrałeś żadnego terminu zajęć.")

            classes = Class.objects.get(pk=classes_id)
            # Sprawdź, czy istnieje pokój między studentem a nauczycielem w danej klasie

            room = Room.objects.filter(
                users=request.user).filter(users=classes.teacher)

            if room.count() == 0:
                room_id = uuid.uuid4().hex[:6].upper()
                # Tworzenie nowego pokoju
                name = request.user.first_name + " " + request.user.last_name + \
                    " - " + classes.teacher.first_name + " " + classes.teacher.last_name

                new_room = Room.objects.create(
                    room_id=room_id, name=name
                )
                new_room.users.add(student, classes.teacher)

            valid_schedules = []

            for slot in selected_slots:
                exists_classes = Schedule.objects.filter(
                    date=slot).filter(student=student)

                if exists_classes.exists():
                    raise ValidationError(
                        "W jednym z wybranych terminów już masz zaplanowane inne zajęcia.")

                schedule_data = {
                    'date': slot,
                    'student': student.id,
                    'classes': classes.id,
                    'place_of_classes': place,
                    'room': new_room.room_id if room.first() is None else room.first().room_id,
                }
                # Dodaj do listy poprawnych danych
                valid_schedules.append(schedule_data)

            purchase_classes_serializer = PurchaseClassesSerializer(
                data=valid_schedules, many=True)
            purchase_classes_serializer.is_valid(raise_exception=True)
            purchase_classes_serializer.save()

            datetime_slots = [datetime.strptime(
                slot, "%Y-%m-%dT%H:%M:%S") for slot in selected_slots]
            datetime_slots.sort()

            purchase = PurchaseHistory(
                student=student,
                classes=classes,
                room=new_room if room.first() is None else room.first(),
                place_of_classes=place,
                amount_of_lessons=len(selected_slots),
                start_date=datetime_slots[0],
                paid_price=len(selected_slots)*classes.price_for_lesson,
            )

            purchase.save()

    except ValidationError as e:
        return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)

    purchase_serializer = PurchaseHistorySerializer(purchase)

    return Response(purchase_serializer.data, status=status.HTTP_201_CREATED)


class PurchaseHistoryList(generics.ListAPIView):
    serializer_class = PurchaseHistorySerializer
    pagination_class = PurchaseHistoryPagination
    permission_classes = [IsAuthenticated, IsStudent]

    def get_queryset(self):
        user = self.request.user

        queryset = PurchaseHistory.objects.filter(student=user)
        return queryset


class TeacherOpinionsList(generics.ListAPIView):
    serializer_class = OpinionSerializer
    pagination_class = OpinionPagination
    lookup_field = 'teacher_id'

    def get_queryset(self):
        teacher_id = self.kwargs['teacher_id']
        queryset = Opinion.objects.filter(teacher_id=teacher_id)
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)

        serializer = self.get_serializer(page, many=True)
        paginated = self.get_paginated_response(serializer.data)

        average_rating = queryset.aggregate(Avg('rate'))['rate__avg']

        response_data = {
            "count": len(queryset),
            "next": paginated.data['next'],
            "previous": paginated.data['previous'],
            "results": serializer.data,
            "average_rating": average_rating,
        }
        return Response(response_data, status=status.HTTP_200_OK)


class ReceivedOpinionsList(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OpinionSerializer
    pagination_class = OpinionPagination

    def get_queryset(self):
        user = self.request.user

        queryset = Opinion.objects.filter(teacher=user)

        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)

        serializer = self.get_serializer(page, many=True)
        paginated = self.get_paginated_response(serializer.data)

        average_rating = queryset.aggregate(Avg('rate'))['rate__avg']

        response_data = {
            "count": len(queryset),
            "next": paginated.data['next'],
            "previous": paginated.data['previous'],
            "results": serializer.data,
            "average_rating": average_rating,
        }
        return Response(response_data, status=status.HTTP_200_OK)


class CreateOpinionView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CreateOpinionSerializer

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
