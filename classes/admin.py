from django.contrib import admin
from .models import Class, Language, TypeOfClasses, Schedule
# Register your models here.

admin.site.register(Class)
admin.site.register(Language)
admin.site.register(TypeOfClasses)
admin.site.register(Schedule)
