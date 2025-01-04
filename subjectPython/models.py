from django.db import models
from django.contrib.auth.models import User

class Brand(models.Model):
    class Meta:
        db_table = 'brand'

    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Category(models.Model):
    class Meta:
        db_table = 'category'

    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Product(models.Model):
    class Meta:
        db_table = 'product'

    name = models.CharField(max_length=255)
    image = models.ImageField(upload_to='media/')
    brand = models.ForeignKey('Brand', on_delete=models.CASCADE)
    category = models.ForeignKey('Category', on_delete=models.CASCADE)
    description = models.TextField(max_length=500, blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_quantity = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    brand = models.ForeignKey(Brand, on_delete=models.SET_NULL, null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    status_id = models.IntegerField(default=1)
    shipping_address = models.TextField()
    shipping_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    is_delivered = models.BooleanField(default=False)
    create_at = models.DateTimeField(auto_now_add=True)
    delivered_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'order'

    def __str__(self):
        return f"Order {self.id}"

class OrderDetail(models.Model):
    order = models.ForeignKey(Order, related_name='details', on_delete=models.CASCADE)
    product_id = models.IntegerField()
    quantity = models.PositiveIntegerField()

    class Meta:
        db_table = 'order_detail'

    def __str__(self):
        return f"Detail {self.id} for Order {self.order.id}"
    def __str__(self):
        return self.name
