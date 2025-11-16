from django.contrib import admin
from .models import Product

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "price")

from .models import BlogPost, Prebooking, Order


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ("title", "published")


@admin.register(Prebooking)
class PrebookingAdmin(admin.ModelAdmin):
    list_display = ("user_name", "service_name", "preferred_date", "preferred_time")


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "amount", "status", "created_at")
