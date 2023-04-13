from django.conf import settings
from rest_framework.routers import DefaultRouter, SimpleRouter

from chat.api.views import ConversationViewSet, MessageViewSet
from auth_user.views import UserViewSet
from django.urls import path, include

if settings.DEBUG:
    router = DefaultRouter()
else:
    router = SimpleRouter()

router.register("conversations", ConversationViewSet)
router.register("users", UserViewSet)
router.register("messages", MessageViewSet)


# app_name = "api"
urlpatterns = router.urls
