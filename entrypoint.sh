#!/bin/sh
set -e

echo "===> Running migrations"
python manage.py migrate --noinput

echo "===> Collecting static files"
python manage.py collectstatic --noinput

PORT_TO_BIND=${PORT:-8000}

echo "===> Starting Gunicorn on 0.0.0.0:${PORT_TO_BIND}"
exec gunicorn wellness_project.wsgi:application --bind 0.0.0.0:${PORT_TO_BIND} --workers 3 --timeout 120
