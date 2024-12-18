from django.db import models


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
