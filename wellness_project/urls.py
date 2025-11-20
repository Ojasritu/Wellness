from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.utils import timezone
from shop import views
from shop import api as shop_api
from shop import chatbot_improved as chatbot
from django.urls import include

def health_check(request):
    """Health check endpoint that returns basic application status."""
    try:
        from django.db import connection
        connection.ensure_connection()
        db_status = "ok"
    except Exception as e:
        db_status = str(e)

    response_data = {
        "status": "ok",
        "database": db_status,
        "timestamp": timezone.now().isoformat()
    }
    
    response = JsonResponse(response_data, status=200)
    # Ensure health check responses aren't cached
    response["Cache-Control"] = "no-cache, no-store, must-revalidate"
    return response

urlpatterns = [
    path("admin/", admin.site.urls),
    # Django-allauth endpoints for social authentication
    path('accounts/', include('allauth.urls')),
    path("", views.home, name="home"),
    path("checkout/", views.checkout, name="checkout"),
    path("success/", views.success, name="success"),
    # API (DRF)
    path('api/', include(shop_api.urlpatterns)),
    # Chatbot API
    path('api/chat/', chatbot.chat_with_ayurveda_ai, name='chat'),
    path('api/dosha-analyzer/', chatbot.dosha_analyzer, name='dosha_analyzer'),
    path('api/ayurveda-tips/', chatbot.get_ayurveda_tips, name='ayurveda_tips'),
    # Health check endpoint for deployment
    path("healthz/", health_check),
    path("healthz", health_check),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
