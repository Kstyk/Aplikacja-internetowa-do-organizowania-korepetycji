release: python manage.py migrate && python manage.py migrate auth_user && python manage.py migrate chat
web: daphne backend.asgi:application --port $PORT --bind 0.0.0.0 -v2
worker: python manage.py runworker channels --settings=backend.settings -v2
