from django.contrib import admin
from .models import Class, Language, TypeOfClasses
# Register your models here.

admin.site.register(Class)
admin.site.register(Language)
admin.site.register(TypeOfClasses)
