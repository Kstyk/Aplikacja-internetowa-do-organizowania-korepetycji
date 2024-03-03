from django.contrib import admin
from .models import User, Role, UserDetails, Address, PrivateMessage
from .forms import CustomUserCreationForm, CustomUserChangeForm
from django.contrib.auth.admin import UserAdmin
from django import forms
from cities_light.models import City, Region
# Register your models here.


class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = User
    list_display = ("id", "email", "first_name", "last_name", "role",
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


class AddressForm(forms.ModelForm):
    class Meta:
        model = Address
        fields = '__all__'

    # city = forms.ChoiceField(choices=city_name)
    # voivodeship = forms.ChoiceField(choices=voivodeship_name)


class CustomAddressAdmin(admin.ModelAdmin):
    model = Address
    list_display = ("get_voivodeship_name", "get_city_name", "postal_code",
                    "street", "building_number")
    form = AddressForm

    def get_voivodeship_name(self, obj):
        if obj.voivodeship:
            return obj.voivodeship.name
        else:
            return None

    get_voivodeship_name.short_description = "Województwo"

    def get_city_name(self, obj):
        if obj.city:
            return obj.city.name
        else:
            return None
    get_city_name.short_description = "Miasto"


class CustomPrivateMessageAdmin(admin.ModelAdmin):
    model = PrivateMessage
    list_display = ("from_user", "to_user", "content", "timestamp")


admin.site.register(User, CustomUserAdmin)
admin.site.register(Role)
admin.site.register(UserDetails, CustomUserDetailsAdmin)
admin.site.register(Address, CustomAddressAdmin)
admin.site.register(PrivateMessage, CustomPrivateMessageAdmin)
