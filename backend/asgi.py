"""
ASGI config for backend project.
It exposes the ASGI callable as a module-level variable named ``application``.
For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/asgi/
"""

from django.core.asgi import get_asgi_application
from pathlib import Path
import sys
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
from channels.routing import ProtocolTypeRouter, URLRouter  # noqa isort:skip

ROOT_DIR = Path(__file__).resolve(strict=True).parent.parent
sys.path.append(str(ROOT_DIR / "backend"))

application = get_asgi_application()
