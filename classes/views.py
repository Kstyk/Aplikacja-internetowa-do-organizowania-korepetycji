from django.utils import timezone
from django.conf import settings
from django.core.mail import send_mail
from .models import Class, Language, Schedule, Timeslot, PurchaseHistory, Opinion
from rooms.models import Room
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from .serializers import *
from rest_framework.response import Response
from rest_framework import status, generics
from django.db.models import Q, F
from django.db import transaction
from .paginators import ClassPagination, PurchaseHistoryPagination, OpinionPagination, AskClassesPagination
from users.permissions import IsStudent, IsTeacher
from django.db.models import Count
from cities_light.models import City, Region
from datetime import datetime
from rest_framework.serializers import ValidationError
import uuid
from django.db.models import Avg
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
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
    min_price = request.GET.get('min_price')
    max_price = request.GET.get('max_price')
    language = request.GET.get('language')
    city_id = request.GET.get('city')
    voivodeship_id = request.GET.get('voivodeship')
    teacher_id = request.GET.get('teacher')
    able_online = request.GET.get('able_online')
    classes = Class.objects.filter(able_to_buy=True)

    if teacher_id is not None:
        classes = classes.filter(teacher__id=teacher_id)
    if search_text is not None:
        classes = classes.filter(Q(name__icontains=search_text) | Q(
            description__icontains=search_text))
    if language is not None:
        classes = classes.filter(language__slug=language)
    if voivodeship_id is not None:
        voivodeship = Region.objects.get(pk=voivodeship_id)

        classes = classes.filter(address__voivodeship=voivodeship)
    if city_id is not None:
        city = City.objects.get(pk=city_id)
        classes = classes.filter(address__city=city)

    if min_price is not None:
        classes = classes.filter(price_for_lesson__gte=min_price)
    if max_price is not None:
        classes = classes.filter(price_for_lesson__lte=max_price)
    if able_online is not None:
        if able_online == 'true':
            classes = classes.filter(place_of_classes__contains='online')
        else:
            pass

    # sortowanie
    sort_by = request.GET.get('sort_by', 'name')
    sort_direction = request.GET.get('sort_direction', 'DESC')

    if sort_direction is not None:
        if sort_direction == 'DESC':
            if sort_by == 'name':
                classes = classes.order_by(F(sort_by).desc())
            if sort_by == 'price_for_lesson':
                classes = classes.order_by(F(sort_by).desc())
            if sort_by == 'average_rating':
                classes = classes.annotate(
                    average_rate=Avg('teacher__rated_teacher__rate'))
                classes = classes.order_by('-average_rate')

        elif sort_direction == 'ASC':
            if sort_by == 'name':
                classes = classes.order_by(F(sort_by).asc())
            if sort_by == 'price_for_lesson':
                classes = classes.order_by(F(sort_by).asc())
            if sort_by == 'average_rating':
                classes = classes.annotate(
                    average_rate=Avg('teacher__rated_teacher__rate'))
                classes = classes.order_by('average_rate')
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
    permission_classes = [IsAuthenticated, IsTeacher]
    serializer_class = CreateClassSerializer
    queryset = Class.objects.all()

    def post(self, request):
        data = request.data
        data["teacher"] = request.user.id
        data["language"] = data["language"]["id"]
        serializer = self.get_serializer(
            data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'success': 'Zajęcia zostały utworzone.'}, status=status.HTTP_201_CREATED)

    def put(self, request, pk):
        try:
            class_instance = Class.objects.get(id=pk)
        except Class.DoesNotExist:
            return Response({'error': 'Zajęcia nie istnieją.'}, status=status.HTTP_404_NOT_FOUND)

        if request.user.id is not class_instance.teacher.id:
            return Response({'error': 'Nie jesteś właścicielem tych zajęć.'}, status=status.HTTP_403_FORBIDDEN)

        data = request.data
        data["language"] = data["language"]["id"]

        serializer = UpdateClassSerializer(instance=class_instance, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': 'Zajęcia zostały zaktualizowane.'}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TeacherClassesView(generics.ListAPIView):
    permission_classes = [IsAuthenticated, IsTeacher]
    serializer_class = ClassTeacherViewSerializer

    def get_queryset(self):
        user = self.request.user

        queryset = Class.objects.filter(teacher=user)
        return queryset


class TimeSlotsCreateView(generics.ListCreateAPIView):
    serializer_class = CreateTimeSlotsSerializer
    permission_classes = [IsAuthenticated, IsTeacher]

    def create(self, request, *args, **kwargs):
        data = request.data
        many = isinstance(data, list)

        Timeslot.objects.filter(teacher=request.user).delete()

        serializer = self.get_serializer(data=data, many=many)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response(serializer.data)


class TimeslotsTeacherView(generics.ListAPIView):
    serializer_class = TimeslotSerializer

    def get_queryset(self):
        teacher_id = self.kwargs.get('teacher_id')
        return Timeslot.objects.filter(teacher_id=teacher_id)


class ScheduleTeacherView(generics.ListAPIView):
    serializer_class = ScheduleSerializer

    def get_queryset(self):
        teacher_id = self.kwargs.get('teacher_id')
        queryset = Schedule.objects.filter(classes__teacher_id=teacher_id)
        return queryset


class ScheduleStudentView(generics.ListAPIView):
    serializer_class = ScheduleSerializer

    def get_queryset(self):
        student_id = self.kwargs.get('student_id')
        return Schedule.objects.filter(student_id=student_id)


@api_view(['GET'])
def get_top_languages(request):
    top_languages = Language.objects.annotate(
        num_classes=Count('class_language')
    ).order_by('-num_classes')[:20]

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

            if classes.able_to_buy is False:
                raise ValidationError(
                    "Te zajęcia nie są dostępne do zakupu.")

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
                    date=slot).filter(Q(student=student))

                if exists_classes.exists():
                    raise ValidationError(
                        "W jednym z wybranych terminów już masz zaplanowane inne zajęcia.")

                schedule_data = {
                    'date': slot,
                    'student': student.id,
                    'classes': classes.id,
                    'place_of_classes': place,
                    'room': new_room.room_id if room.first() is None else room.first().room_id,
                    'address': classes.address.id if place == 'teacher_home' else None
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
                address=classes.address if place == 'teacher_home' else None
            )
            purchase.save()

            send_mail(
                'Zakupiono twoje zajęcia',
                f'''
                Cześć, {classes.teacher.first_name}

                Student {student.first_name} {student.last_name} zakupił twoje zajęcia: {classes.name}.

                Link do utworzonego pokoju zajęć: http://localhost:5173/pokoj/{purchase.room.room_id}/
                
                Pozdrawiamy, zespół korki.PL''',
                settings.EMAIL_HOST_USER,
                [classes.teacher.email],
                fail_silently=False,
            )

    except ValidationError as e:
        return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)

    purchase_serializer = PurchaseHistorySerializer(purchase)

    return Response(purchase_serializer.data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsStudent])
def purchase_classes_after_ask(request):
    selected_slots = request.data.get('selected_slots', [])
    student = request.user
    classes_id = request.data.get('classes_id', [])
    place = 'student_home'
    address_id = request.data.get('address_id', None)

    try:
        with transaction.atomic():  # Rozpoczęcie transakcji
            if len(selected_slots) == 0:
                raise ValidationError(
                    "Nie wybrałeś żadnego terminu zajęć.")

            classes = Class.objects.get(pk=classes_id)
            address = Address.objects.get(pk=address_id)

            askclasses = AskClasses.objects.get(
                Q(address=address) & Q(classes=classes) & Q(student=student))

            if askclasses is not None:
                if askclasses.accepted is False:
                    raise ValidationError("Niepoprawny adres zajęć.")

                if askclasses.accepted is True and askclasses.bought is True:
                    raise ValidationError(
                        "Już zakupiłeś zajęcia pod wskazanym adresem po wczesniejszym zapytaniu.")

            else:
                raise ValidationError("Niepoprawny adres zajęć.")

            if classes.able_to_buy is False:
                raise ValidationError(
                    "Te zajęcia nie są dostępne do zakupu.")

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
                    'address': address.id
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
                address=address
            )
            purchase.save()

            send_mail(
                'Zakupiono twoje zajęcia',
                f'''
                Cześć, {classes.teacher.first_name}

                Student {student.first_name} {student.last_name} zakupił twoje zajęcia: {classes.name}.

                Link do utworzonego pokoju zajęć: http://localhost:5173/pokoj/{purchase.room.room_id}/
                
                Pozdrawiamy, zespół korki.PL''',
                settings.EMAIL_HOST_USER,
                [classes.teacher.email],
                fail_silently=False,
            )

    except ValidationError as e:
        return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)

    purchase_serializer = PurchaseHistorySerializer(purchase)
    askclasses.bought = True
    askclasses.save()

    return Response(purchase_serializer.data, status=status.HTTP_201_CREATED)


class PurchaseHistoryList(generics.ListAPIView):
    serializer_class = PurchaseHistorySerializer
    pagination_class = PurchaseHistoryPagination
    permission_classes = [IsAuthenticated, IsStudent]

    def get_queryset(self):
        user = self.request.user

        queryset = PurchaseHistory.objects.filter(student=user)
        return queryset


class TeacherPurchaseHistoryList(generics.ListAPIView):
    serializer_class = PurchaseHistorySerializer
    pagination_class = PurchaseHistoryPagination
    permission_classes = [IsAuthenticated, IsTeacher]

    def get_queryset(self):
        user = self.request.user

        queryset = PurchaseHistory.objects.filter(classes__teacher=user)
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


class AddedOpinionsList(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OpinionSerializer
    pagination_class = OpinionPagination

    def get_queryset(self):
        user = self.request.user

        queryset = Opinion.objects.filter(student=user)

        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)

        serializer = self.get_serializer(page, many=True)
        paginated = self.get_paginated_response(serializer.data)

        response_data = {
            "count": len(queryset),
            "next": paginated.data['next'],
            "previous": paginated.data['previous'],
            'num_pages': paginated.data['num_pages'],
            "results": serializer.data,
        }
        return Response(response_data, status=status.HTTP_200_OK)


class CreateOpinionView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated, IsStudent]
    serializer_class = CreateOpinionSerializer

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()


class UpdateOpinionView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated, IsStudent]
    serializer_class = UpdateOpinionSerializer
    queryset = Opinion.objects.all()

    def perform_update(self, serializer):
        if serializer.is_valid():
            serializer.save()


class DeleteOpinionView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Opinion.objects.all()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        if request.user.id != instance.student.id:
            return Response({'error': "Nie możesz usunąć tej opinii."}, status=status.HTTP_403_FORBIDDEN)

        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class ClassesBoughtByStudentToRateView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def get(self, request):
        student = self.request.user

        try:
            teacher_id = request.GET.get('teacher_id')
            teacher = User.objects.get(
                Q(id=teacher_id) & Q(role__name="Teacher"))
        except User.DoesNotExist:
            return Response({'error': 'Nie istnieje nauczyciel o takim ID.'}, status=status.HTTP_404_NOT_FOUND)

        classes = PurchaseHistory.objects.filter(
            Q(student=student) & Q(classes__teacher=teacher))

        unique_list = []

        for obj in classes:
            if obj.classes not in unique_list:
                opinion = Opinion.objects.filter(
                    Q(student=student) & Q(classes_rated=obj.classes))

                # Jeśli nie znaleziono opinii, wstaw do uniquelist obj.classes
                if not opinion:
                    unique_list.append(obj.classes)

        serializer = ClassSerializer(
            unique_list, many=True)

        return Response(serializer.data)


class AskClassesCreateView(generics.CreateAPIView):
    serializer_class = AskClassesCreateSerializer
    permission_classes = [IsAuthenticated, IsStudent]

    def create(self, request, *args, **kwargs):
        data = request.data
        data['student'] = request.user.id

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)

        self.perform_create(serializer)

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ResponseAskClassesView(generics.UpdateAPIView):
    serializer_class = ResponseAskClassesSerializer
    permission_classes = [IsAuthenticated, IsTeacher]

    def get_object(self):
        data = self.request.data

        obj = AskClasses.objects.get(id=data["id"])

        return obj


class SendedQuestionsListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated, IsStudent]
    serializer_class = AskClassesListSerializer
    pagination_class = AskClassesPagination

    def get_queryset(self):
        user = self.request.user

        queryset = AskClasses.objects.filter(
            student=user).order_by('-sended_at')
        return queryset


class ReceivedQuestionsListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated, IsTeacher]
    serializer_class = AskClassesListSerializer
    pagination_class = AskClassesPagination

    def get_queryset(self):
        user = self.request.user

        queryset = AskClasses.objects.filter(
            classes__teacher=user).order_by('-sended_at')

        return queryset
