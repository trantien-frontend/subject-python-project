"""
Django settings for subjectPython project.

Generated by 'django-admin startproject' using Django 5.1.4.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.1/ref/settings/
"""
import os.path
from pathlib import Path

from django.conf.global_settings import STATICFILES_FINDERS, STATICFILES_DIRS

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-4z#n7a==2^3fr92-0wq*-sbfr1i7k8mpjp_3((gtne8==@!s1p'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []

# AUTH_USER_MODEL = 'subjectPython.User'

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.humanize',
    'rest_framework',
    'subjectPython'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'subjectPython.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': ['templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'subjectPython.wsgi.application'

# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'mssql',  # Engine cho SQL Server
        'NAME': 'quan_ly_ban_hang',  # Tên database bạn muốn kết nối
        'USER': 'sa',  # Tài khoản SQL Server
        'PASSWORD': 'sql@12345678',  # Mật khẩu
        'HOST': 'localhost',  # Địa chỉ server
        'PORT': 1433,  # Có thể để trống (sử dụng cổng mặc định 1433)
        'OPTIONS': {
            'driver': 'ODBC Driver 17 for SQL Server',  # Driver ODBC (cài đặt sẵn)
        },
    }
}

# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = 'static/'
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static'),
]

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Đảm bảo rằng SESSION_ENGINE được thiết lập để sử dụng cơ sở dữ liệu để lưu session
SESSION_ENGINE = 'django.contrib.sessions.backends.db'  # Lưu session vào database

# Session sẽ hết hạn sau khoảng thời gian này (mặc định 300 giây = 5 phút)
SESSION_COOKIE_AGE = 300  # thời gian tính bằng giây

# Lưu trữ session trong cookie
SESSION_COOKIE_NAME = 'sessionid'

# Tên miền của cookie (nếu bạn cần tùy chỉnh)
SESSION_COOKIE_DOMAIN = None

# Đảm bảo session không thể truy cập được qua JavaScript
SESSION_COOKIE_HTTPONLY = False

# Nếu bạn muốn session hết hạn khi người dùng đóng trình duyệt
SESSION_EXPIRE_AT_BROWSER_CLOSE = False

# Cấu hình xem session có được giữ lại khi người dùng không hoạt động
SESSION_SAVE_EVERY_REQUEST = True
