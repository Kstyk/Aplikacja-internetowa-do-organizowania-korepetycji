from django.contrib import admin
from .models import Class, Language, Schedule, Timeslot, PurchaseHistory
# Register your models here.


class ScheduleAdmin(admin.ModelAdmin):
    model = Schedule
    list_display = ('id', 'date', 'student', 'classes')


admin.site.register(Class)
admin.site.register(Language)
admin.site.register(Schedule, ScheduleAdmin)
admin.site.register(Timeslot)
admin.site.register(PurchaseHistory)
