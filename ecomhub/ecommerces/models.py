from cloudinary.models import CloudinaryField
from django.contrib.auth.models import AbstractUser
from django.db import models


# Create your models here.
class User(AbstractUser):
    is_shop_owner = models.BooleanField(default=0)
    avatar = CloudinaryField(null=True)
    phone = models.CharField(max_length=10, null=True)


class BaseModel(models.Model):
    active = models.BooleanField(default=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Category(BaseModel):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Inventory(BaseModel):
    quantity = models.IntegerField(default=1)
    product = models.OneToOneField('Product', on_delete=models.CASCADE, null=True, related_name="inventory")


class Discount(BaseModel):
    name = models.CharField(max_length=50)
    percentage = models.FloatField(default=0)
    amount = models.IntegerField(default=0)
    product = models.ForeignKey('Product', on_delete=models.CASCADE, null=True, blank=True, related_name="discounts")
    order = models.ForeignKey('Order', on_delete=models.CASCADE, null=True, blank=True, related_name="discounts")

    def __str__(self):
        return self.name


class ProductImage(BaseModel):
    image = CloudinaryField(null=True, blank=True)
    product = models.ForeignKey('Product', on_delete=models.CASCADE, related_name="images")


class Shop(BaseModel):
    name = models.CharField(max_length=200)
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Product(BaseModel):
    name = models.CharField(max_length=100)
    price = models.IntegerField(default=0)
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, null=True, related_name="products")
    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True, related_name="products")

    def __str__(self):
        return self.name


class Cart(BaseModel):
    total = models.IntegerField(default=0)  # Tổng giá trị giỏ hàng hiện tại (chưa áp dụng giảm giá, phí ship)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="cart")


class CartDetail(BaseModel):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="cart_details")
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="details")
    quantity = models.IntegerField()


class Comment(BaseModel):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    star = models.IntegerField(null=True, blank=True)
    content = models.TextField(null=True, blank=True)
    image = CloudinaryField(null=True, blank=True)
    comment_parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name="replies")

    def __str__(self):
        return self.content


ORDER_STATUSES = [
    ('PENDING', 'Chờ xác nhận'),
    ('PAID', 'Đã thanh toán'),
    ('SHIPPING', 'Đang giao'),
    ('COMPLETED', 'Đã giao'),
    ('CANCELLED', 'Đã hủy'),
]


class Order(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    total = models.IntegerField(default=0)  # Tổng giá trị đơn hàng cuối cùng (đã tính giảm giá, phí ship)
    shipping_address = models.CharField(max_length=150, null=True)
    status = models.CharField(max_length=20, choices=ORDER_STATUSES, default='PENDING')

    def __str__(self):
        return f"Order's {self.user.username}"


class OrderDetail(BaseModel):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="orderdetails")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="orderdetails")
    quantity = models.IntegerField(default=0)


PAYMENT_METHODS = [
    ('PAYPAL', 'Paypal'),
    ('COD', 'Thanh toán khi nhận hàng'),
    ('BANK', 'Chuyển khoản ngân hàng'),
]


class Payment(BaseModel):
    payment_method = models.CharField(max_length=50, choices=PAYMENT_METHODS, default='COD')
    total = models.IntegerField(default=0)  # Số tiền người dùng đã thực sự trả (thường nên bằng Order.total)
    status = models.BooleanField()
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='payment', null=True)
