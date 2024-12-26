from rest_framework import serializers as serialize
from .models import Category, Brand

class CategorySerializer(serialize.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'icon']

class BrandSerializer(serialize.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'name'] 