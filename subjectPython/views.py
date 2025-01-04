from django.contrib.auth import login
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth.hashers import make_password, check_password
from django.core.paginator import Paginator
from django.contrib.auth import logout
from django.conf import settings
import json

from .models import Product, Brand, Category


# view home_page
def home_page(request):
    ss_products = Product.objects.filter(brand=1).order_by('-id')[:6]
    return render(request, 'index.html', {"ss_products": ss_products})


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
                return JsonResponse({"success": True, "url": "/"})
            else:
                return JsonResponse({"success": False, "password": "Mật khẩu không đúng"})
        except User.DoesNotExist:
            print("user does not exist")
            return JsonResponse({"success": False, "email": "Email không tồn tại"})


def admin_login_form(request):
    # Check form
    if request.method == "POST":
        email = request.POST['email']
        password = request.POST['password']
        try:
            user = User.objects.get(email=email)
            if check_password(password, user.password):
                if user.is_staff:
                    login(request, user)
                    return redirect("dashboard")
                else:
                    return render(request, 'admin-login-form.html', {'is_default_header': True, "authenticationError": "Bạn không có quyền đăng nhập ?"})
            else:
                return render(request, 'admin-login-form.html',
                          {'is_default_header': True, "password": "Invalid Password"})
        except User.DoesNotExist:
            return render(request, 'admin-login-form.html',
                      {'is_default_header': True, "email": "Invalid Email"})
    # Check authentication
    if request.user.is_authenticated and request.user.is_staff:
        return redirect("dashboard")
    else:
        return render(request, 'admin-login-form.html', {'is_default_header': True})


def dashboard(request):
    page = request.GET.get('page', 'index')
    cols = check_cols(page)
    data = check_data(page)
    total_page = check_current_page(page)
    context = {
        'is_default_header': True,
        'page': page,
        'cols': cols,
        'data': data,
        "total_page": range(1, total_page + 1),
    }
    if request.user.is_authenticated and request.user.is_staff:
        return render(request, 'dashboard.html', context)
    else:
        return redirect("admin-login-form")


def check_data(page):
    items = []
    if page == "users":
        dic_items = User.objects.filter(is_staff=False).values("id", "first_name", "last_name", "email", "is_staff",
                                                               "is_active",
                                                               "date_joined")[:10]
        for user in dic_items:
            user['date_joined'] = user['date_joined'].strftime('%B %d, %Y')
            items.append(user)
    if page == "products":
        dic_items = Product.objects.select_related('brand', 'category').all()[:5]
        for product in dic_items:
            items.append({
                'id': product.id,
                'name': product.name,
                'image': product.image.url if product.image else None,
                'brand': product.brand.name,  # Lấy tên thương hiệu
                'category': product.category.name,  # Lấy tên danh mục
                'description': product.description,
                'price': product.price,
                'stock_quantity': product.stock_quantity,
                'created_at': product.created_at.strftime('%B %d, %Y'),
                'updated_at': product.updated_at.strftime('%B %d, %Y')
            })
    return items


def check_cols(page):
    cols = []
    users_col = ["#", "Họ", "Tên", "Email", "ROLE", "Trạng thái", "Ngày đăng ký"]
    products_col = ["#", "tên sản phẩm", "giá tiền", "thương hiệu", "danh mục", "hình ảnh", "ngày nhập hàng"]
    orders_col = []

    if page == "users":
        cols = users_col
    if page == "products":
        cols = products_col
    if page == "orders":
        cols = orders_col
    return cols


def check_current_page(page):
    total_page = 1
    if page == "users":
        users_list = User.objects.all()
        paginator = Paginator(users_list, 10)
        total_page = paginator.num_pages
    if page == "products":
        product_list = Product.objects.all()
        paginator = Paginator(product_list, 5)
        total_page = paginator.num_pages
    return total_page


def get_user_by_id(request, user_id):
    user = User.objects.get(id=user_id)
    user_data = {
        'id': user.id,
        'firstName': user.first_name,
        'lastName': user.last_name,
        'email': user.email,
        'status': user.is_active
    }
    return JsonResponse({"success": True, "user": user_data})


def users(request):
    if request.method == 'POST':
        first_name = request.POST['firstname']
        last_name = request.POST['lastname']
        email = request.POST['email']
        is_active = True if request.POST.get('status') == "True" else False
        password = "TestPass1909"
        user = User.objects.create_user(username=email, email=email, password=password, first_name=first_name,
                                        last_name=last_name, is_active=is_active)
        return JsonResponse({"success": True, "message": "Thêm người dùng thành công"})

    if request.method == 'GET':
        users_list = User.objects.all()

        paginator = Paginator(users_list, 10)
        page_number = request.GET.get('current_page')
        print(page_number)
        page_obj = paginator.get_page(page_number)

        dic_items = list(
            page_obj.object_list.values('id', 'username', 'email', 'first_name', 'last_name', 'is_active',
                                        "date_joined"))

        users_data = []

        for user in dic_items:
            user['date_joined'] = user['date_joined'].strftime('%B %d, %Y')  # Chuyển thành dạng 'January 01, 2025'
            users_data.append(user)

        return JsonResponse({
            "success": True,
            "users": users_data,
            "page": page_obj.number,
            "total_pages": paginator.num_pages,
            "total_users": paginator.count
        })

    return JsonResponse({"error": "Some error occurred"}, status=500)

def user_logout(request):
    logout(request)
    return redirect("admin-login-form")

def edit_user(request):
    if request.method == 'POST':
        user_id = request.POST['id']
        first_name = request.POST['firstname']
        last_name = request.POST['lastname']
        email = request.POST['email']
        is_active = True if request.POST.get('status') == "True" else False

        user = User.objects.filter(id=user_id).first()
        user.first_name = first_name
        user.last_name = last_name
        user.email = email
        user.is_active = is_active
        user.save()

        return JsonResponse({
            "success": True,
            "message": "Cập nhật thành công"
        })


def delete_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user_id = data.get('id')
        user = User.objects.get(id=user_id)
        user.delete()
        print("id", user_id)

    return JsonResponse({
        "success": True,
        "message": "Xóa user thành công"
    })


def products(request):
    if request.method == 'POST':
        name = request.POST['name']
        brand_id = request.POST['brand']
        category_id = request.POST['category']
        price = request.POST['price']
        image = request.FILES['image']

        brand = Brand.objects.get(id=brand_id)
        category = Category.objects.get(id=category_id)

        product = Product(
            name=name,
            brand=brand,
            category=category,
            price=price,
            image=image,
            stock_quantity=10,
        )
        product.save()
        return JsonResponse({"success": True, "message": "Thêm sản phẩm thành công"})
    if request.method == 'GET':
        products_list = Product.objects.all()

        # Phân trang, 10 sản phẩm mỗi trang
        paginator = Paginator(products_list, 5)
        page_number = request.GET.get('current_page', 1)  # Lấy số trang từ request (mặc định là trang 1)
        page_obj = paginator.get_page(page_number)

        # Chuyển danh sách sản phẩm thành dict
        dic_items = [
            {
                "id": product.id,
                "name": product.name,
                "brandName": product.brand.name if product.brand else None,
                "categoryName": product.category.name if product.category else None,
                "price": product.price,
                "image": f"{settings.MEDIA_URL}{product.image}" if product.image else None,
                "createdAt": product.created_at,
            }
            for product in page_obj.object_list
        ]

        # Trả về dữ liệu dưới dạng JSON
        return JsonResponse({
            "success": True,
            "products": dic_items,
            "page": page_obj.number,
            "total_pages": paginator.num_pages,
            "total_products": paginator.count
        })

    return JsonResponse({"error": "Some error occurred"}, status=500)


def get_product_by_id(request, product_id):
    product = Product.objects.get(id=product_id)
    product_data = {
        'id': product.id,
        'name': product.name,
        'brand': product.brand_id,
        'category': product.category_id,
        'price': product.price
    }

    return JsonResponse({"success": True, "product": product_data})


def edit_product(request):
    if request.method == 'POST':
        product_id = request.POST['id']
        name = request.POST['name']
        brand_id = request.POST['brand']
        category_id = request.POST['category']
        price = request.POST['price']
        image = request.FILES['image']

        product = Product.objects.get(id=product_id)
        product.name = name
        product.brand = Brand.objects.get(id=brand_id)
        product.category = Category.objects.get(id=category_id)
        product.price = price

        if image:
            product.image = image

        product.save()

        return JsonResponse({
            "success": True,
            "message": "Cập nhật thành công"
        })
    return JsonResponse({"error": "Some error occurred"}, status=500)

def delete_product(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        product_id = data.get('id')
        product = Product.objects.get(id=product_id)
        product.delete()

    return JsonResponse({
        "success": True,
        "message": "Xóa product thành công"
    })
