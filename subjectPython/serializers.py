from rest_framework import serializers as serialize
from .models import Category, Brand, Product

class CategorySerializer(serialize.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class BrandSerializer(serialize.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'name'] 

class ProductSerializer(serialize.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'image', 'description', 'price', 'stock_quantity', 'created_at', 'updated_at', 'brand_id', 'category_id'] 