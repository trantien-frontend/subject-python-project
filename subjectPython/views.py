import json
from django.contrib.auth import login
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth.hashers import make_password, check_password
from .models import OrderDetail, Order, Product, Category, Brand
from django.shortcuts import get_object_or_404
from .serializers import CategorySerializer, BrandSerializer

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

def add_to_cart(request):
    if request.method == 'POST':
        product_id = request.POST.get('product_id')
        if not product_id:
            return JsonResponse({'success': False, 'message': 'Invalid product ID.'})

        cart = request.session.get('cart', {})

        if product_id in cart:
            cart[product_id] += 1
        else:
            cart[product_id] = 1

        request.session['cart'] = cart

        print("Giỏ hàng hiện tại:", cart)

        return JsonResponse({'success': True, 'message': 'Product added to cart.'})

    return JsonResponse({'success': False, 'message': 'Invalid request method.'})

def cart(request):
    cart = request.session.get('cart', {})

    cart_items = []
    total_price = 0

    for product_id, quantity in cart.items():
        product = get_object_or_404(Product, id=product_id)
        cart_items.append({
            'product': product,
            'quantity': quantity,
            'price': product.price,
            'total_price': product.price * quantity
        })
        total_price += product.price * quantity

    return render(request, 'cart.html', {'cart_items': cart_items, 'total_price': total_price})

def handle_order(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        user_id = 1
        status_id = 1
        shipping_address = data.get('address')
        shipping_price = 0
        is_delivered = True
        products = data.get('products', [])

        order = Order.objects.create(
            user_id=user_id,
            status_id=status_id,
            shipping_address=shipping_address,
            shipping_price=shipping_price,
            is_delivered=is_delivered
        )

        for detail in products:
            product_id = detail.get('productId')
            quantity = detail.get('quantity')

            OrderDetail.objects.create(
                order=order,
                product_id=product_id,
                quantity=quantity
            )

        response_data = {
            "order_id": order.id,
            "user_id": order.user_id,
            "status_id": order.status_id,
            "shipping_address": order.shipping_address,
            "shipping_price": order.shipping_price,
            "is_delivered": order.is_delivered,
            "details": [{"product_id": detail.product_id, "quantity": detail.quantity} for detail in order.details.all()]
        }

        return JsonResponse({'data': response_data})

def load_header_data(request):
    categories = Category.objects.all()
    brands = Brand.objects.all()

    category_serializer = CategorySerializer(categories, many=True)
    brand_serializer = BrandSerializer(brands, many=True)

    return JsonResponse({
        "categories": category_serializer.data,
        "brands": brand_serializer.data
    })