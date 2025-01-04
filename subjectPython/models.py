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

    name = models.CharField(max_length=255)
    image = models.ImageField(upload_to='media/')
    brand = models.ForeignKey('Brand', on_delete=models.CASCADE)
    category = models.ForeignKey('Category', on_delete=models.CASCADE)
    description = models.TextField(max_length=500, blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_quantity = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
