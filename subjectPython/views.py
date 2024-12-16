from django.http import HttpResponse
from django.shortcuts import render


def home_page (request):
    return render(request, 'index.html')

def product_page (request):
    return render(request, 'products.html')

def product_detail_page (request):
    return render(request, 'product-details.html')





