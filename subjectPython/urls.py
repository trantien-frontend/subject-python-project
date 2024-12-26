"""
URL configuration for subjectPython project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path("", views.home_page, name="home"),
    path("products/", views.product_page, name="products"),
    path("product-detail/", views.product_detail_page),
    path("login-form/", views.login_form),
    path("login/", views.handle_login),
    path("register-form/", views.register_form),
    path("register/",views.handle_register),
    path("cart/",views.cart),
    path('add-to-cart/', views.add_to_cart),
    path('order/', views.handle_order),
    path('header/', views.load_header_data),
]
