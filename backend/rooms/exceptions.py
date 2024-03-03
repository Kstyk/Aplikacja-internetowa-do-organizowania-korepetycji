from rest_framework.exceptions import APIException


class AccessDeniedForRoom(APIException):
    status_code = 403
    default_detail = "Nie masz dostępu do tego pokoju"
    default_code = "access_denied_for_room"
