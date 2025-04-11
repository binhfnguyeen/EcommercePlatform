from cloudinary.models import CloudinaryField
from django.contrib.auth.models import AbstractUser
from django.db import models


# Create your models here.
class User(AbstractUser):
    is_shop_owner = models.BooleanField(default=0)
    avatar = CloudinaryField(null=True)


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
    image = CloudinaryField()
    product = models.ForeignKey('Product', on_delete=models.CASCADE, related_name="images")


class Shop(BaseModel):
    name = models.CharField(max_length=200)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Product(BaseModel):
    name = models.CharField(max_length=100)
    price = models.IntegerField(default=0)
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, null=True, related_name="products")
    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.name


class Cart(BaseModel):
    total = models.IntegerField(default=0)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="cart")


class CartDetail(BaseModel):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="products")
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="details")
    quantity = models.IntegerField()


class Comment(BaseModel):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    star = models.IntegerField(null=True, blank=True)
    content = models.TextField(null=True, blank=True)
    image = CloudinaryField()
    comment_parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name="replies")

    def __str__(self):
        return self.content


class Order(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    total = models.IntegerField(default=0)
    shipping_address = models.CharField(max_length=150, null=True)
    payment = models.OneToOneField('Payment', on_delete=models.CASCADE, null=True)


class OrderDetail(BaseModel):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()


class Payment(BaseModel):
    name = models.CharField(max_length=150, null=True)
    total = models.IntegerField(default=0)
    status = models.BooleanField()

    def __str__(self):
        return self.name
