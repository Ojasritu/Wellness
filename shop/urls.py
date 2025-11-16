from django.urls import path
from . import views

urlpatterns = [
    path('', views.product_list, name='home'),
    path('products/', views.product_list, name='products'),
    path('product/<int:product_id>/', views.product_detail, name='product_detail'),

    # Cart
    path('cart/', views.cart_view, name='cart'),
    path('add-to-cart/<int:product_id>/', views.add_to_cart, name='add_to_cart'),
    path('remove-from-cart/<int:item_id>/', views.remove_from_cart, name='remove_from_cart'),
    path('checkout/', views.checkout, name='checkout'),

    # User
    path('account/', views.account, name='account'),
    path('signup/', views.signup_view, name='signup'),
    path('contact/', views.contact_view, name='contact'),
]
