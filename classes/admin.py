from django.contrib import admin
from .models import Class, Language, Schedule, Timeslot, PurchaseHistory, Opinion
# Register your models here.


class ScheduleAdmin(admin.ModelAdmin):
    model = Schedule
    list_display = ('id', 'date', 'student', 'classes', 'room')


class OpinionAdmin(admin.ModelAdmin):
    model = Opinion
    list_display = ('id', 'student', 'teacher', 'rate', 'published_date')


class LanguageAdmin(admin.ModelAdmin):
    model = Language
    list_display = ('name', 'slug')


admin.site.register(Class)
admin.site.register(Class)
admin.site.register(Language, LanguageAdmin)
admin.site.register(Schedule, ScheduleAdmin)
admin.site.register(Timeslot)
admin.site.register(PurchaseHistory)
admin.site.register(Opinion, OpinionAdmin)
