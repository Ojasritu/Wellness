from rest_framework import serializers, viewsets, routers, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.urls import path, include
from .models import (
    Category, Product, ProductReview, Cart, CartItem,
    Order, Rebooking, Article, FAQ, ContactMessage
)
from .models import Profile
from django.contrib.auth import get_user_model, login
import json
import os

from django.views.decorators.csrf import csrf_exempt

# For Google ID token verification
from google.oauth2 import id_token as google_id_token
from google.auth.transport import requests as google_requests
from django.core.files.base import ContentFile
import requests


# ===== SERIALIZERS =====

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'hindi_name', 'slug', 'description', 'icon', 'background_image']


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    discount_percentage = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'hindi_name', 'slug', 'description', 'benefits',
            'ingredients', 'price', 'discount_price', 'discount_percentage',
            'category', 'category_name', 'image', 'dosha_type', 'quantity_in_stock',
            'is_bestseller', 'is_featured', 'rating', 'status', 'sku'
        ]
    
    def get_discount_percentage(self, obj):
        if obj.discount_price:
            return int(((obj.price - obj.discount_price) / obj.price) * 100)
        return 0


class ProductDetailSerializer(ProductSerializer):
    reviews = serializers.SerializerMethodField()
    
    class Meta(ProductSerializer.Meta):
        fields = ProductSerializer.Meta.fields + ['usage_instructions', 'scientific_research', 'gallery', 'reviews']
    
    def get_reviews(self, obj):
        reviews = obj.reviews.all()[:5]
        return ProductReviewSerializer(reviews, many=True).data


class ProductReviewSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.username', read_only=True)
    
    class Meta:
        model = ProductReview
        fields = ['id', 'product', 'customer_name', 'rating', 'title', 'comment', 'verified_purchase', 'created_at']
        read_only_fields = ['id', 'created_at']


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    total_price = serializers.SerializerMethodField()
    
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity', 'total_price', 'added_at']
    
    def get_total_price(self, obj):
        return obj.get_total_price()


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()
    
    class Meta:
        model = Cart
        fields = ['id', 'customer', 'items', 'total_price', 'created_at']
    
    def get_total_price(self, obj):
        return obj.get_total_price()


class OrderSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.username', read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'order_id', 'customer', 'customer_name', 'total_amount',
            'discount_amount', 'tax_amount', 'final_amount', 'status',
            'payment_method', 'payment_status', 'created_at'
        ]
        read_only_fields = ['order_id', 'created_at']


class RebookingSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.username', read_only=True)
    
    class Meta:
        model = Rebooking
        fields = [
            'id', 'customer', 'customer_name', 'consultation_type',
            'scheduled_date', 'scheduled_time', 'health_concerns',
            'dosha_type', 'status', 'consultation_fee', 'is_paid', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class ArticleSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)
    
    class Meta:
        model = Article
        fields = ['id', 'title', 'hindi_title', 'slug', 'excerpt', 'featured_image', 'category',
                  'author', 'author_name', 'views', 'is_published', 'is_featured', 'created_at']


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = ['id', 'question_en', 'question_hi', 'answer_en', 'answer_hi', 'category']


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'phone', 'subject', 'message', 'category', 'created_at']
        read_only_fields = ['id', 'created_at']


# ===== VIEWSETS =====

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ProductSerializer
    lookup_field = 'slug'
    
    def get_queryset(self):
        queryset = Product.objects.filter(status='active')
        category = self.request.query_params.get('category')
        dosha = self.request.query_params.get('dosha')
        bestseller = self.request.query_params.get('bestseller')
        
        if category:
            queryset = queryset.filter(category__slug=category)
        if dosha:
            queryset = queryset.filter(dosha_type=dosha)
        if bestseller:
            queryset = queryset.filter(is_bestseller=True)
        
        return queryset
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductSerializer


class ProductReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ProductReviewSerializer
    
    def get_queryset(self):
        return ProductReview.objects.filter(product__slug=self.kwargs.get('product_slug'))
    
    def perform_create(self, serializer):
        product = Product.objects.get(slug=self.kwargs.get('product_slug'))
        serializer.save(product=product, customer=self.request.user)


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return Order.objects.all()
        return Order.objects.filter(customer=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)


class RebookingViewSet(viewsets.ModelViewSet):
    serializer_class = RebookingSerializer
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return Rebooking.objects.all()
        return Rebooking.objects.filter(customer=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)


class ArticleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Article.objects.filter(is_published=True)
    serializer_class = ArticleSerializer
    lookup_field = 'slug'


class FAQViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FAQ.objects.filter(is_active=True)
    serializer_class = FAQSerializer
    
    @action(detail=False, methods=['get'])
    def by_category(self, request):
        category = request.query_params.get('category')
        if category:
            faqs = FAQ.objects.filter(category=category, is_active=True)
            serializer = self.get_serializer(faqs, many=True)
            return Response(serializer.data)
        return Response({'error': 'category parameter required'}, status=status.HTTP_400_BAD_REQUEST)


class ContactMessageViewSet(viewsets.ModelViewSet):
    serializer_class = ContactMessageSerializer
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return ContactMessage.objects.all()
        return ContactMessage.objects.filter(email=self.request.user.email)


# ===== PROFILE SERIALIZER & VIEW =====
class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = Profile
        fields = ['id', 'username', 'email', 'avatar', 'phone', 'bio']


class ProfileAPIView(APIView):
    """Simple profile endpoints for the current authenticated user"""

    def get(self, request):
        user = request.user
        if not user.is_authenticated:
            return Response({'detail': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        profile, _ = Profile.objects.get_or_create(user=user)
        serializer = ProfileSerializer(profile, context={'request': request})
        return Response(serializer.data)

    def put(self, request):
        user = request.user
        if not user.is_authenticated:
            return Response({'detail': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        profile, _ = Profile.objects.get_or_create(user=user)
        # Allow updating Profile fields and basic User fields
        data = request.data.copy()
        # If user fields are present, update them
        if 'first_name' in data:
            request.user.first_name = data.get('first_name')
        if 'last_name' in data:
            request.user.last_name = data.get('last_name')
        if 'email' in data:
            request.user.email = data.get('email')
        request.user.save()

        serializer = ProfileSerializer(profile, data=data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ===== ROUTER =====

router = routers.DefaultRouter()

router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'products', ProductViewSet, basename='product')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'rebookings', RebookingViewSet, basename='rebooking')
router.register(r'articles', ArticleViewSet, basename='article')
router.register(r'faqs', FAQViewSet, basename='faq')
router.register(r'contact', ContactMessageViewSet, basename='contact')

urlpatterns = router.urls
urlpatterns += [
    path('profile/', ProfileAPIView.as_view(), name='api-profile'),
]


class LogoutAPIView(APIView):
    """API endpoint to log out the current user"""

    def post(self, request):
        from django.contrib.auth import logout
        logout(request)
        return Response({'detail': 'logged out'})


urlpatterns += [
    path('logout/', LogoutAPIView.as_view(), name='api-logout'),
]


# ===== Google ID token auth endpoint =====
class GoogleAuthAPIView(APIView):
    """Accepts Google ID token (from client-side) and logs in/creates user."""

    @csrf_exempt
    def post(self, request):
        try:
            body = request.data
            id_token = body.get('id_token') or body.get('credential')
            if not id_token:
                return Response({'detail': 'id_token required'}, status=status.HTTP_400_BAD_REQUEST)

            # Verify token
            client_id = os.getenv('GOOGLE_CLIENT_ID')
            try:
                idinfo = google_id_token.verify_oauth2_token(id_token, google_requests.Request(), client_id)
            except Exception as e:
                return Response({'detail': 'Invalid token', 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

            # idinfo contains 'email', 'given_name', 'family_name', 'picture', 'email_verified'
            email = idinfo.get('email')
            if not email:
                return Response({'detail': 'Email not available in token'}, status=status.HTTP_400_BAD_REQUEST)

            User = get_user_model()
            user, created = User.objects.get_or_create(email=email, defaults={
                'username': email.split('@')[0],
                'first_name': idinfo.get('given_name', ''),
                'last_name': idinfo.get('family_name', ''),
            })

            # Update user names if changed
            changed = False
            if user.first_name != idinfo.get('given_name', ''):
                user.first_name = idinfo.get('given_name', '')
                changed = True
            if user.last_name != idinfo.get('family_name', ''):
                user.last_name = idinfo.get('family_name', '')
                changed = True
            if changed:
                user.save()

            # Create profile and possibly save avatar URL
            profile, _ = Profile.objects.get_or_create(user=user)
            picture = idinfo.get('picture')
            if picture:
                try:
                    # download the image and save to profile.avatar
                    r = requests.get(picture, timeout=5)
                    if r.status_code == 200:
                        ext = picture.split('.')[-1].split('?')[0]
                        if len(ext) > 5:
                            ext = 'jpg'
                        file_name = f"avatar_{user.username}.{ext}"
                        profile.avatar.save(file_name, ContentFile(r.content), save=True)
                except Exception:
                    # ignore avatar download errors
                    pass

            # Log the user in via session
            login(request, user)

            serializer = ProfileSerializer(profile, context={'request': request})
            return Response({'created': created, 'profile': serializer.data})

        except Exception as exc:
            return Response({'detail': 'Error during authentication', 'error': str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


urlpatterns += [
    path('auth/google/', GoogleAuthAPIView.as_view(), name='api-auth-google'),
]


# ===== Avatar delete endpoint =====
class AvatarDeleteAPIView(APIView):
    def delete(self, request):
        user = request.user
        if not user.is_authenticated:
            return Response({'detail': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        profile, _ = Profile.objects.get_or_create(user=user)
        if profile.avatar:
            profile.avatar.delete(save=False)
            profile.avatar = None
            profile.save()
        return Response({'detail': 'avatar deleted'})


urlpatterns += [
    path('profile/avatar/', AvatarDeleteAPIView.as_view(), name='api-profile-avatar-delete'),
]
