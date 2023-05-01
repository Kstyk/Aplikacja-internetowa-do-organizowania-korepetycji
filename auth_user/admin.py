from django.contrib import admin
from .models import CustomUser
# Register your models here.


class CustomUserAdmin(admin.ModelAdmin):
    list_display = ("username", "email", "last_name",
                    "first_name", "phone_number")


admin.site.register(CustomUser, CustomUserAdmin)
