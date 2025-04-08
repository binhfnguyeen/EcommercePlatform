from django.contrib import admin
from ecommerces.models import Product, Shop, Product, ProductImage, Category, Discount


# Register your models here.

class ProductInline(admin.TabularInline):
    model = Product
    extra = 0


class ShopAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'user']
    inlines = [ProductInline, ]


class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'price']


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    fields = ['image']


class ProductAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'price', 'shop']
    search_fields = ['name']
    list_filter = ['price']
    inlines = [ProductImageInline, ]


admin.site.register(Shop, ShopAdmin)
admin.site.register(Product, ProductAdmin)
