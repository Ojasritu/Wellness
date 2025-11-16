from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to="products/", blank=True, null=True)

    def __str__(self):
        return self.name


class BlogPost(models.Model):
    title = models.CharField(max_length=250)
    slug = models.SlugField(max_length=250, unique=True)
    content = models.TextField()
    published = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Prebooking(models.Model):
    user_name = models.CharField(max_length=200)
    service_name = models.CharField(max_length=200)
    preferred_date = models.DateField()
    preferred_time = models.TimeField()
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user_name} - {self.service_name} @ {self.preferred_date}"


class Order(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    razorpay_payment_id = models.CharField(max_length=200, blank=True, null=True)
    status = models.CharField(max_length=50, default='pending')

    def __str__(self):
        return f"Order {self.id} — {self.status}"
