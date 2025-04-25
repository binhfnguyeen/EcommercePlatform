from django.template.defaulttags import comment
from rest_framework.serializers import ModelSerializer
from unicodedata import category

from .models import Category, Product, Inventory, ProductImage, Shop, Cart, CartDetail, Comment, Discount, Order, \
    OrderDetail, Payment, User


class CategorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'first_name', 'last_name', 'is_shop_owner', 'avatar']

    def create(self, validated_data):
        data = validated_data.copy()
        u = User(**data)
        u.set_password(u.password)
        u.save()

        return u

    def update(self, instance, validated_data):
        avatar = validated_data.get('avatar')

        if isinstance(avatar, str):
            instance.avatar = avatar
        elif avatar:
            instance.avatar = avatar

        instance.save()
        return instance


class ShopSerializer(ModelSerializer):
    class Meta:
        model = Shop
        fields = ['id', 'name']


class ProductImageSerializer(ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['image'] = instance.image.url
        return data


class ProductSerializer(ModelSerializer):
    shop = ShopSerializer()
    category = CategorySerializer()
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'shop', 'category', 'price', 'images']

    def create(self, validated_data):
        data = validated_data.copy()
        p = Product(name=data['name'], price=data['price'])
        if data['shop']:
            s, _ = Shop.objects.get_or_create(name=data['shop']['name'])
            p.shop = s
        if data['category']:
            c, _ = Category.objects.get_or_create(name=data['category']['name'])
            p.category = c
        p.save()

        return p


class ProductDetailSerializer(ProductSerializer):
    pass


class CommentSerializer(ModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['user'] = UserSerializer(instance.user).data
        return data

    class Meta:
        model = Comment
        fields = ['id', 'user', 'content', 'image', 'comment_parent_id', 'product']

        extra_kwargs = {
            'product': {
                'write_only': True
            }
        }


class PaymentSerializer(ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'payment_method', 'total', 'status', 'order']


class OrderSerializer(ModelSerializer):
    class Meta:
        model = Order
        fields = ['id', 'active', 'user', 'total', 'shipping_address', 'status']


class OrderDetailWithProductSerializer(ModelSerializer):
    product = ProductSerializer()

    class Meta:
        model = OrderDetail
        fields = ['id', 'product', 'quantity']


class CartDetailSerializer(ModelSerializer):
    class Meta:
        model = CartDetail
        fields = ['id', 'quantity', 'product', 'cart']


class CartSerializer(ModelSerializer):
    details = CartDetailSerializer(many=True, read_only=True)  # Error here without read_only or source

    class Meta:
        model = Cart
        fields = ['id', 'user', 'total', 'details']
