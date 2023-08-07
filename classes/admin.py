from django.contrib import admin
from .models import Class, Language, Schedule, Timeslot, PurchaseHistory
# Register your models here.

admin.site.register(Class)
admin.site.register(Language)
admin.site.register(Schedule)
admin.site.register(Timeslot)
admin.site.register(PurchaseHistory)
