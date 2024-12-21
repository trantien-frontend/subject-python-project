from django.contrib.auth import login
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth.hashers import make_password, check_password

from .models import Product


# view home_page
def home_page(request):
    ss_products = Product.objects.filter(brand=1).order_by('-id')[:6]
    print("Debug ss_products:")
    for product in ss_products:
        print(f"ID: {product.id}, Name: {product.name}, Price: {product.price}")
    return render(request, 'index.html', {"ss_products": ss_products})

def cart_page(request):
    return render(request, 'cart.html')


# view register
def register_form(request):
    if request.user.is_authenticated:
        return redirect('/')
    return render(request, 'register.html')


def handle_register(request):
    if request.method == "POST":
        first_name = request.POST['firstname']
        last_name = request.POST['lastname']
        email = request.POST['email']
        password = request.POST['password']
        if User.objects.filter(email=email).exists():
            return JsonResponse({"success": False, "email": "Email đã tồn tại."})
        user = User.objects.create_user(username=email, email=email, password=password, first_name=first_name,
                                        last_name=last_name)
    return JsonResponse({"success": True, "mess": "Đăng ký thành công"})


# view login_form
def login_form(request):
    return render(request, 'login-form.html')


def handle_login(request):
    if request.method == "POST":
        email = request.POST['email']
        password = request.POST['password']
        try:
            user = User.objects.get(email=email)
            if check_password(password, user.password):
                login(request, user)
                print("Login Successful")
                return JsonResponse({"success": True, "url": "/"})
            else:
                print("Invalid password")
                return JsonResponse({"success": False, "email": "Mật khẩu không đúng"})
        except User.DoesNotExist:
            print("user does not exist")
            return JsonResponse({"success": False, "email": "Email không tồn tại"})


def product_page(request):
    return render(request, 'products.html')


def product_detail_page(request):
    return render(request, 'product-details.html')
