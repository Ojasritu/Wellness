import os
from pathlib import Path
import dj_database_url
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# ✅ Base Directory
BASE_DIR = Path(__file__).resolve().parent.parent

# ✅ Security
SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-please-change-this-in-production')
DEBUG = os.getenv('DEBUG', 'True') == 'True'  # Default to True for development

# Allow configuring ALLOWED_HOSTS via environment variable (comma-separated).
# Example: ALLOWED_HOSTS=ojasritu.co.in,www.ojasritu.co.in
_allowed_hosts = os.getenv('ALLOWED_HOSTS')
if _allowed_hosts:
    ALLOWED_HOSTS = [h.strip() for h in _allowed_hosts.split(',') if h.strip()]
else:
    # sensible defaults for local development and Railway preview apps
    ALLOWED_HOSTS = ["localhost", "127.0.0.1", ".up.railway.app", "ojasritu.co.in", "www.ojasritu.co.in"]

# When behind a proxy (Railway, Heroku, etc) ensure Django knows HTTPS is proxied
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# Production security flags (only enforced when DEBUG is False)
if not DEBUG:
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    # Make SSL redirect configurable and default to False for health checks
    SECURE_SSL_REDIRECT = os.getenv('SECURE_SSL_REDIRECT', 'False') == 'True'
    SECURE_HSTS_SECONDS = int(os.getenv('SECURE_HSTS_SECONDS', 3600))
    SECURE_HSTS_INCLUDE_SUBDOMAINS = os.getenv('SECURE_HSTS_INCLUDE_SUBDOMAINS', 'True') == 'True'
    SECURE_HSTS_PRELOAD = os.getenv('SECURE_HSTS_PRELOAD', 'False') == 'True'
    
    # Skip SSL redirect for health check endpoint
    SECURE_REDIRECT_EXEMPT = [r'^healthz/?$']
else:
    # Local/dev defaults
    SESSION_COOKIE_SECURE = False
    CSRF_COOKIE_SECURE = False
    SECURE_SSL_REDIRECT = False

# ✅ Installed Apps
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "shop",
    # API and CORS for frontend
    "rest_framework",
    "corsheaders",
    # Authentication
    "django.contrib.sites",
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    "allauth.socialaccount.providers.google",
]

SITE_ID = 1

# ✅ Middleware
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "allauth.account.middleware.AccountMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# Allow local frontend dev and production origins (configure via env in Railway)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
]

# ✅ CSRF Configuration for local development
if DEBUG:
    CSRF_TRUSTED_ORIGINS = [
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]
    CSRF_COOKIE_HTTPONLY = False  # Allow JavaScript to access CSRF token in development
else:
    CSRF_TRUSTED_ORIGINS = os.getenv('CSRF_TRUSTED_ORIGINS', '').split(',') if os.getenv('CSRF_TRUSTED_ORIGINS') else []

# ✅ Root URLs & WSGI
ROOT_URLCONF = "wellness_project.urls"
WSGI_APPLICATION = "wellness_project.wsgi.application"

# ✅ Templates
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
                "django.template.context_processors.media",
            ],
        },
    },
]

# ✅ Database
DATABASES = {
    "default": dj_database_url.config(
        default="sqlite:///" + str(BASE_DIR / "db.sqlite3"),
        conn_max_age=600,
    )
}

# ✅ Password Validation
AUTH_PASSWORD_VALIDATORS = []

# ✅ Language & Timezone
LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Kolkata"
USE_I18N = True
USE_TZ = True

# ✅ Static & Media Files
STATIC_URL = "/static/"
STATICFILES_DIRS = [BASE_DIR / "static"]
STATIC_ROOT = BASE_DIR / "staticfiles"  # ✅ Needed for collectstatic
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# ✅ Default Primary Key Field
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ✅ Google OAuth Configuration
SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'SCOPE': [
            'profile',
            'email',
        ],
        'AUTH_PARAMS': {
            'access_type': 'online',
        },
        'APP': {
            'client_id': os.getenv('GOOGLE_CLIENT_ID'),
            'secret': os.getenv('GOOGLE_SECRET_KEY'),
            'key': ''
        }
    }
}

# ✅ Stripe & Gemini API Keys
STRIPE_PUBLISHABLE_KEY = os.getenv('STRIPE_PUBLISHABLE_KEY', 'pk_test_YOUR_KEY')
STRIPE_SECRET_KEY = os.getenv('STRIPE_SECRET_KEY', 'sk_test_YOUR_KEY')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', '')

# ✅ Default Primary Key Field
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ✅ Stripe Placeholders (optional)
STRIPE_PUBLISHABLE_KEY = "pk_test_YOUR_KEY"
STRIPE_SECRET_KEY = "sk_test_YOUR_KEY"
