from django.shortcuts import render
from .models import TypeOfClasses, Class, Language
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from .serializers import TypeOfClassesSerializer, ClassSerializer, LanguageSerializer, CreateClassSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from users.models import User

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
    classes = Class.objects.all()
    serializer = ClassSerializer(classes, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def create_class(request):
    # print(request.user.id)
    # return Response(status=status.HTTP_200_OK)
    classesData = request.data
    classesData['teacher'] = request.user.id
    serializer = CreateClassSerializer(data=classesData)
    if serializer.is_valid():
        serializer.save()
        return Response({'success': 'Klasa została utworzona'}, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
