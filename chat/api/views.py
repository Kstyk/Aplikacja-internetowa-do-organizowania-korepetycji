from rest_framework.generics import get_object_or_404
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin
from rest_framework.viewsets import GenericViewSet
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import action
from django.http import HttpResponse
from rest_framework import status
import json
from django.contrib.auth import get_user_model
from chat.models import Conversation, Message
from .paginaters import MessagePagination
from .serializers import ConversationSerializer, MessageSerializer

User = get_user_model()


def check_user_in_conversation(request, name):
    try:
        user = TokenAuthentication().authenticate(request)[0]
    except:
        raise AuthenticationFailed('Invalid Token')

    if user is not None and user.is_authenticated:
        conversation = get_object_or_404(Conversation, name=name)
        if user in conversation.users.all():
            print("Ok")
            # return True
            return HttpResponse(json.dumps({'result': 'User is in conversation'}), status=status.HTTP_200_OK)
    return HttpResponse(json.dumps({'result': 'User is not in conversation'}), status=status.HTTP_400_BAD_REQUEST)


class ConversationViewSet(ListModelMixin, RetrieveModelMixin, GenericViewSet):
    serializer_class = ConversationSerializer
    queryset = Conversation.objects.none()
    lookup_field = "name"

    def get_queryset(self):
        token = self.request.META.get('HTTP_AUTHORIZATION')
        print(token)

        try:
            user = Token.objects.get(
                key=token).user
        except Token.DoesNotExist:
            raise AuthenticationFailed(("Invalid token."))

        print(user)

        print("tu jest jeszcze ok")
        queryset = Conversation.objects.filter(
            name__contains=user.username
        )

        return queryset

    def get_serializer_context(self):
        return {"request": self.request, "fields": self.request.query_params.get('fields')}

    def create(self, request, *args, **kwargs):
        name = request.data.get('name')

        if not Conversation.objects.filter(name=name).exists():
            student = User.objects.get(username=request.data.get('student'))

            token = self.request.META.get('HTTP_AUTHORIZATION')
            print(token)
            user = Token.objects.get(key=token).user
            conversation = Conversation.objects.create(name=name)

            conversation.join(user)
            conversation.join(student)

            serializer = ConversationSerializer(instance=conversation, context={
                                                "request": self.request, "fields": self.request.query_params.get('fields')})
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response("Taki pokoj juz istnieje", status=status.HTTP_400_BAD_REQUEST)


class MessageViewSet(ListModelMixin, GenericViewSet):
    serializer_class = MessageSerializer
    queryset = Message.objects.none()
    pagination_class = MessagePagination

    def get_queryset(self):
        conversation_name = self.request.GET.get("conversation")
        queryset = (
            Message.objects.filter(
                conversation__name__contains=self.request.user.username,
            )
            .filter(conversation__name=conversation_name)
            .order_by("-timestamp")
        )
        return queryset
