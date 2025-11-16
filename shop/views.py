from django.shortcuts import render, redirect
from .models import Product
from django.conf import settings
from django.http import JsonResponse, HttpResponse

def home(request):
    products = Product.objects.all()
    return render(request, "home.html", {"products": products})

def checkout(request):
    products = Product.objects.all()
    total = sum(p.price for p in products)
    return render(request, "checkout.html", {"products": products, "total": total, "stripe_pub": settings.STRIPE_PUBLISHABLE_KEY})

def success(request):
    return render(request, "success.html")


def health(request):
    """Simple health endpoint for platform healthchecks."""
    return HttpResponse("OK", content_type="text/plain")
