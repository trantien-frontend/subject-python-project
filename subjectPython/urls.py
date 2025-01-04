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
from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

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
    path('brand/<int:id>/', views.product_list_by_brand),
    path('category/<int:id>/', views.product_list_by_category),
    path('remove-item-from-cart/', views.remove_item_from_cart),
    path('remove-cart/', views.remove_cart),
    path('brand/<int:id>/products/', views.get_product_list_by_brand_id),
    path('category/<int:id>/products/', views.get_product_list_by_category_id),
    path('products/search/', views.product_list_by_search_key),
    path('api/products/search/', views.get_product_list_by_search_key),
    path("", views.home_page, name="home"),
    path("login-form/", views.login_form),
    path("login/", views.handle_login),
    path("register-form/", views.register_form),
    path("register/", views.handle_register),
    path('admin-login/', views.admin_login_form, name='admin-login-form'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path("users/", views.users, name="users"),
    path("users-update/", views.edit_user),
    path("user-delete/", views.delete_user),
    path("users/<int:user_id>/", views.get_user_by_id),
    path("products/", views.products),
    path("products-update/", views.edit_product),
    path("products/<int:product_id>/", views.get_product_by_id),
    path("product-delete/", views.delete_product),
    path("user-logout/", views.user_logout),
  ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# if settings.DEBUG:
#     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
