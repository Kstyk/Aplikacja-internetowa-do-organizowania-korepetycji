from django.contrib import admin
from .models import User, Role, UserDetails, Address
from .forms import CustomUserCreationForm, CustomUserChangeForm
from django.contrib.auth.admin import UserAdmin

# Register your models here.


class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = User
    list_display = ("email", "first_name", "last_name", "role",
                    "is_staff", "is_active",)
    list_display = ("email", "first_name", "last_name", "role",
                    "is_staff", "is_active",)
    fieldsets = (
        (None, {"fields": ("email", "password", "first_name", "last_name", "role")}),
        ("Permissions", {"fields": ("is_staff",
         "is_active", "groups", "user_permissions")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": (
                "email", "password1", "password2", "first_name", "last_name",  "role", "is_staff",
                "is_active", "groups", "user_permissions"
            )}
         ),
    )
    search_fields = ("email",)
    ordering = ("email",)


class CustomUserDetailsAdmin(admin.ModelAdmin):
    model = UserDetails
    list_display = ("user_id", "user_email", "description")

    def user_email(self, obj):
        return obj.user.email

    user_email.short_description = "Email użytkownika"


class CustomAddressAdmin(admin.ModelAdmin):
    model = Address
    list_display = ("voivodeship", "city", "postal_code",
                    "street", "building_number")


admin.site.register(User, CustomUserAdmin)
admin.site.register(Role)
admin.site.register(UserDetails, CustomUserDetailsAdmin)
admin.site.register(Address, CustomAddressAdmin)
