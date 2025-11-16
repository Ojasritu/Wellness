from rest_framework import serializers, viewsets, routers
from .models import Product
from django.urls import path, include
from .models import Product, BlogPost, Prebooking, Order


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'image']


class BlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'slug', 'content', 'published']


class PrebookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prebooking
        fields = ['id', 'user_name', 'service_name', 'preferred_date', 'preferred_time', 'quantity', 'created_at']


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['id', 'amount', 'razorpay_payment_id', 'status', 'created_at']


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class BlogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BlogPost.objects.all()
    serializer_class = BlogSerializer


class PrebookingViewSet(viewsets.ModelViewSet):
    queryset = Prebooking.objects.all()
    serializer_class = PrebookingSerializer


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer


router = routers.DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'blog', BlogViewSet)
router.register(r'prebook', PrebookingViewSet)
router.register(r'orders', OrderViewSet)

# API URLs to include in project URLs
api_urls = [
    path('', include(router.urls)),
]
