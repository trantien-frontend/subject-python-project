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

    name = models.CharField(max_length=255, null=True, blank=True)
    image = models.CharField(max_length=50, null=True, blank=True)
    description = models.CharField(max_length=500, null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    stock_quantity = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(null=True, blank=True)

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