from django.shortcuts import render
from .models import TypeOfClasses, Class, Language
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from .serializers import TypeOfClassesSerializer, ClassSerializer, LanguageSerializer
from rest_framework.response import Response

# Create your views here.


@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def get_types_of_classes(request):
    types = TypeOfClasses.objects.all()
    serializer = TypeOfClassesSerializer(types, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_all_classes(request):
    classes = Class.objects.all()
    serializer = ClassSerializer(classes, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_languages(request):
    languages = Language.objects.all()
    serializer = LanguageSerializer(languages, many=True)
    return Response(serializer.data)
