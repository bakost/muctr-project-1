"""
WSGI config for bakost project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/wsgi/
"""

import os
import sys

from django.core.wsgi import get_wsgi_application

sys.path.append('/var/www/bakost')
sys.path.append('/var/www/bakost/bakost')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bakost.settings')

application = get_wsgi_application()
