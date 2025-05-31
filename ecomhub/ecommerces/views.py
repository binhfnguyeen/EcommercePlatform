from _ast import Or
from itertools import product
from pickle import FALSE

import requests
from django.http import HttpResponse
from django.shortcuts import render
from django.template.defaulttags import comment
from django.utils.timezone import activate
from rest_framework import filters
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import ListAPIView, CreateAPIView
from rest_framework.response import Response
from rest_framework.templatetags.rest_framework import data, items
from unicodedata import category
from urllib3 import request
from . import paginators
from . import perms
from . import serializers
from .models import Category, Product, Inventory, ProductImage, Shop, Cart, CartDetail, Comment, Order, \
    OrderDetail, Payment, User, CommentLike
from rest_framework import viewsets, permissions, generics, parsers, status
from rest_framework.decorators import action
from .serializers import CategorySerializer, UserSerializer, ShopSerializer, ProductSerializer, CommentSerializer, \
    ProductImageSerializer, OrderSerializer, OrderDetailWithProductSerializer, \
    PaymentSerializer, CartSerializer, CartDetailSerializer
from django.db.models import Sum, F, functions as db_func, Q,ExpressionWrapper, FloatField
from rest_framework.views import APIView
from django.conf import settings
from datetime import datetime
from django.db.models.functions import ExtractMonth


class CategoryViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Category.objects.filter(active=True)
    serializer_class = CategorySerializer


class UserViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializer
    parser_classes = [parsers.MultiPartParser, ]

    @action(methods=['get', 'patch'], url_path='current-user', detail=False,
            permission_classes=[permissions.IsAuthenticated])
    def get_current_user(self, request):
        if request.method.__eq__("PATCH"):
            u = request.user

            for k, v in request.data.items():
                if k in ['first_name', 'last_name', 'avatar', 'is_shop_owner', 'phone']:
                    setattr(u, k, v)
                elif k.__eq__('password'):
                    u.set_password(v)

            u.save()
            return Response(serializers.UserSerializer(u).data)

        return Response(serializers.UserSerializer(request.user).data)

class ShopViewSet(viewsets.ViewSet, generics.ListCreateAPIView, generics.RetrieveAPIView):
    queryset = Shop.objects.filter(active=True)
    serializer_class = ShopSerializer
    permission_classes = [perms.IsOwnerShop]
    parser_classes = [parsers.MultiPartParser, ]

    @action(methods=['get'], detail=False, url_path='my_shop', permission_classes=[perms.IsOwnerShop])
    def get_my_shop(self, request):
        try:
            shop = Shop.objects.get(user=request.user)
            serializer = ShopSerializer(shop)
        except Shop.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        return Response(serializer.data)

    @action(methods=['get'], url_path='products', detail=True)
    def get_product(self, request, pk):
        shop = self.get_object()

        products = shop.products.all()

        paginator = paginators.ProductPaginator()
        page = paginator.paginate_queryset(products, request)

        if page is not None:
            serializer = ProductSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

    @action(methods=['post'], url_path='create_product', detail=True)
    def create_product(self, request, pk):

        shop = Shop.objects.get(pk=pk)
        category = Category.objects.get(pk=request.data.get('category'))
        p = ProductSerializer(data={
            'name': request.data.get('name'),
            'price': request.data.get('price'),
            'shop': shop.id,
            'category': category.id
        })
        p.is_valid(raise_exception=True)
        d = p.save()
        print(d.id)
        print(request.data.get('images'))
        for img in request.FILES.getlist('images'):
            i = ProductImageSerializer(data={
                'product': d.id,
                'image': img
            })
            print(i)
            i.is_valid(raise_exception=True)
            i.save()
        print(d.shop)
        d.refresh_from_db()
        return Response(ProductSerializer(d).data, status=status.HTTP_201_CREATED)


class ProductViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Product.objects.filter(active=True).prefetch_related('images').all()
    serializer_class = ProductSerializer
    pagination_class = paginators.ProductPaginator
    filter_backends = [filters.OrderingFilter, ]
    ordering_fields = ['name', 'price']

    def get_permissions(self):
        if self.action.__eq__('get_comments'):
            if self.request.method.__eq__('POST'):
                return [permissions.IsAuthenticated()]
        elif self.action.__eq__('like'):
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    def get_object(self):
        return generics.get_object_or_404(self.queryset, pk=self.kwargs.get('pk'))

    def get_queryset(self):
        query = self.queryset

        if self.action.__eq__('list'):
            name = self.request.query_params.get('name')
            if name:
                query = query.filter(name__icontains=name)

            min_price = self.request.query_params.get('min_price')
            max_price = self.request.query_params.get('max_price')
            if min_price:
                query = query.filter(price__gte=min_price)
            if max_price:
                query = query.filter(price__lte=max_price)

            shop_name = self.request.query_params.get('shop_name')
            if shop_name:
                query = query.filter(shop__name__icontains=shop_name)
        for backend in list(self.filter_backends):
            query = backend().filter_queryset(self.request, query, self)
        return query

    @action(methods=['get', 'post'], url_path='comments', detail=True)
    def get_comments(self, request, pk):
        if request.method.__eq__('POST'):
            print(request.method)
            t = CommentSerializer(data={
                'content': request.data.get('content'),
                'user': request.user.pk,
                'product': pk,
                'star': request.data.get('star'),
                'image': request.data.get('image'),
                'comment_parent_id': request.data.get('comment_parent_id')
            })
            t.is_valid(raise_exception=True)
            c = t.save()
            return Response(CommentSerializer(c).data, status=status.HTTP_201_CREATED)
        else:
            comments = self.get_object().comment_set.select_related('user').filter(active=True)
            p = paginators.CommentPaginator()
            page = p.paginate_queryset(comments, self.request)
            if page is not None:
                serializer = CommentSerializer(page, many=True)
                return p.get_paginated_response(serializer.data)
            else:
                return Response(CommentSerializer(comments, many=True).data)


class CommentViewSet(viewsets.ViewSet, generics.DestroyAPIView, generics.UpdateAPIView):
    queryset = Comment.objects.filter(active=True).order_by('id')
    serializer_class = CommentSerializer
    permission_classes = [perms.CommentOwner]


class CommentViewSet(viewsets.ViewSet, generics.ListCreateAPIView, generics.RetrieveAPIView):
    queryset = Comment.objects.filter(active=True).order_by('id')
    serializer_class = CommentSerializer
    pagination_class = paginators.CommentPaginator

    @action(methods=['post'], url_path='reply', detail=True)
    def reply(self, request, pk):
        try:
            comment_parent = Comment.objects.get(pk=pk)
        except Comment.DoesNotExist:
            return Response({'error': 'Parent comment not found.'}, status=status.HTTP_404_NOT_FOUND)
        comment_child = CommentSerializer(data={
            "content": request.data.get('content'),
            "user": request.user.pk,
            'image': request.data.get('image'),
            "product": comment_parent.product.pk
        })
        comment_child.is_valid(raise_exception=True)
        r = comment_child.save(comment_parent=comment_parent, active=True)
        return Response(CommentSerializer(r).data, status=status.HTTP_201_CREATED)

    @action(methods=['get'], url_path='replies', detail=True)
    def get_replies(self, request, pk=None):
        try:
            parent_comment = Comment.objects.get(pk=pk)
        except Comment.DoesNotExist:
            return Response({"error": "Comment not found"}, status=status.HTTP_404_NOT_FOUND)

        replies = Comment.objects.filter(comment_parent=parent_comment, active=True).select_related('user')

        paginator = paginators.CommentPaginator()
        page = paginator.paginate_queryset(replies, request)
        if page is not None:
            serializer = CommentSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        serializer = CommentSerializer(replies, many=True)
        return Response(serializer.data)

    @action(methods=['post'], detail=True, url_path='like')
    def like(self, request, pk):
        try:
            comment = Comment.objects.get(pk=pk)
        except Comment.DoesNotExist:
            return Response({'error': 'Comment not found.'}, status=status.HTTP_404_NOT_FOUND)

        like, created = CommentLike.objects.get_or_create(user=request.user, comment=comment)

        if not created:
            return Response({'message': 'You have already liked this comment.'}, status=status.HTTP_200_OK)

        return Response({'message': 'Comment liked successfully.'}, status=status.HTTP_201_CREATED)

    @action(methods=['get'], detail=True, url_path='likes')
    def get_likes(self, request, pk):
        try:
            comment = Comment.objects.get(pk=pk)
        except Comment.DoesNotExist:
            return Response({'error': 'Comment not found.'}, status=status.HTTP_404_NOT_FOUND)

        like_count = comment.likes.count()
        return Response({'like_count': like_count})



class ProductImageViewSet(viewsets.ViewSet, generics.ListAPIView, generics.CreateAPIView):
    queryset = Product.objects.filter(active=True)
    serializer_class = ProductImageSerializer
    parser_classes = [parsers.MultiPartParser]


class OrderViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView, generics.CreateAPIView):
    queryset = Order.objects.all().order_by('id')
    serializer_class = OrderSerializer
    permission_classes = [perms.OrderOwner]
    pagination_class = paginators.OrderPaginator

    def get_queryset(self):
        query = self.queryset

        if self.action.__eq__('list'):
            id = self.request.query_params.get('id')
            if id:
                query = query.filter(id=id)

            return query

    def get_object(self):
        return generics.get_object_or_404(self.queryset, pk=self.kwargs.get('pk'))

    def create(self, request, *args, **kwargs):
        user = request.user
        shipping_address = request.data.get("shipping_address")
        phone = request.data.get("phone")
        order_status = request.data.get("status")
        items = request.data.get('items', [])

        if not items:
            return Response({'error': 'Danh sách sản phẩm không được để trống'}, status=status.HTTP_400_BAD_REQUEST)

        order = Order.objects.create(user=user, shipping_address=shipping_address, phone=phone, status=order_status)

        total = 0
        for item in items:
            product_id = item.get('product_id')
            quantity = item.get('quantity', 1)

            try:
                product = Product.objects.get(pk=product_id)
            except Product.DoesNotExist:
                order.delete()
                return Response({'error': f"Sản phẩm có ID {product_id} không tồn tại"},
                                status=status.HTTP_404_NOT_FOUND)

            OrderDetail.objects.create(order=order, product=product, quantity=quantity)
            total += product.price * quantity

        order.total = total
        order.save()

        return Response({
            'message': 'Đặt hàng thành công',
            'order_id': order.id,
            'order': OrderSerializer(order).data}, status=status.HTTP_200_OK)

    @action(methods=['delete'], detail=True, url_path='order_cancel')
    def cancel_order(self, request, pk):
        order = self.get_object()

        if order.user != request.user:
            return Response({'error': 'Bạn không có quyền truy cập đơn hàng này'}, status=status.HTTP_400_BAD_REQUEST)

        payment = order.payment
        payment.active = False
        payment.status = False

        order.active = False
        order.status = 'CANCELLED'
        order.save()
        payment.save()

        return Response({'message': 'Đơn hàng đã được hủy thành công.'}, status=status.HTTP_200_OK)

    @action(methods=['patch'], detail=True, url_path='update_address')
    def update_address(self, request, pk):
        order = self.get_object()
        if order.user != request.user:
            return Response({'error': 'Bạn không có quyền truy cập địa chỉ đơn hàng này!'},
                            status=status.HTTP_403_FORBIDDEN)

        new_address = request.data.get('shipping_address')

        if not new_address:
            return Response({'error': 'Missing shipping_address'}, status=status.HTTP_400_BAD_REQUEST)

        order.shipping_address = new_address
        order.save()

        return Response(OrderSerializer(order).data, status=status.HTTP_200_OK)

    @action(methods=['get'], detail=True, url_path='order_details')
    def get_order_details(self, request, pk):
        order = self.get_object()
        orderdetails = order.orderdetails.filter(active=True)

        q = request.query_params.get('q')
        if q:
            orderdetails = orderdetails.filter(product__name__icontains=q)

        return Response(OrderDetailWithProductSerializer(orderdetails, many=True).data, status=status.HTTP_200_OK)


class PaymentViewSet(viewsets.ViewSet, generics.ListAPIView, generics.CreateAPIView):
    queryset = Payment.objects.filter(active=True)
    serializer_class = PaymentSerializer
    pagination_class = paginators.PaymentPaginator
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        query = self.queryset
        if self.action.__eq__('list'):
            id = self.request.query_params.get('id')
            if id:
                query = query.filter(id=id)
        return query

    def get_object(self):
        return generics.get_object_or_404(self.queryset, pk=self.kwargs.get('pk'))

    @action(methods=['post'], detail=True, url_path='create_paypal_payment')
    def create_paypal_payment(self, request, pk):
        if request.method == "POST":
            payment = self.get_object()
            order = payment.order

            if not order or not order.active:
                return Response({"error": "Đơn hàng không tồn tại hoặc đã bị hủy!"}, status=status.HTTP_404_NOT_FOUND)

            if order.user != request.user:
                return Response({"error": "Bạn không có quyền truy cập đơn hàng này"}, status=status.HTTP_403_FORBIDDEN)

            client_id = settings.PAYPAL_CLIENT_ID
            client_secret = settings.PAYPAL_SECRET
            auth = (client_id, client_secret)
            token_res = requests.post(
                'https://api-m.sandbox.paypal.com/v1/oauth2/token',
                data={'grant_type': 'client_credentials'},
                auth=auth
            )

            if token_res.status_code != 200:
                return Response({"error": "Lỗi khi lấy access token từ Paypal"}, status=500)
            access_token = token_res.json().get('access_token')
            headers = {
                'Authorization': f'Bearer {access_token}',
                'Content-Type': 'application/json'
            }
            body = {
                "intent": "CAPTURE",
                "purchase_units": [
                    {
                        "reference_id": f"ORDER-{order.id}",
                        "description": "Thanh toán đơn hàng EcomSale",
                        "amount": {
                            "currency_code": "USD",
                            "value": str(order.total)
                        }
                    }
                ],
                "application_context": {
                    "return_url": "http://127.0.0.1:8000/payments/paypal-success",
                    "cancel_url": "http://127.0.0.1:8000/payments/paypal-cancel"
                }
            }
            res = requests.post(
                'https://api-m.sandbox.paypal.com/v2/checkout/orders',
                json=body,
                headers=headers
            )
            if res.status_code != 201:
                return Response({'error': 'Không thể tạo đơn PayPal'}, status=500)

            data = res.json()
            approve_url = next((link['href'] for link in data['links'] if link['rel'] == 'approve'), None)

            return Response({'paypal_approve_url': approve_url}, status=status.HTTP_200_OK)


def paypal_success_view(request):
    token = request.GET.get("token")
    payer_id = request.GET.get("PayerID")

    if not token or not payer_id:
        return HttpResponse("Thiếu thông tin token hoặc payer_id", status=400)

    client_id = settings.PAYPAL_CLIENT_ID
    client_secret = settings.PAYPAL_SECRET
    auth = (client_id, client_secret)

    token_res = requests.post(
        'https://api-m.sandbox.paypal.com/v1/oauth2/token',
        data={'grant_type': 'client_credentials'},
        auth=auth
    )

    if token_res.status_code != 200:
        return HttpResponse("Lỗi lấy access token", status=500)

    access_token = token_res.json().get('access_token')
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }

    capture_res = requests.post(
        f'https://api-m.sandbox.paypal.com/v2/checkout/orders/{token}/capture',
        headers=headers
    )

    if capture_res.status_code != 201:
        return HttpResponse("Lỗi khi xác nhận thanh toán", status=500)

    reference_id = capture_res.json()['purchase_units'][0]['reference_id']
    order_id = reference_id.replace("ORDER-", "")

    try:
        payment = Payment.objects.get(order__id=order_id)
        payment.status = True
        payment.save()

        order = payment.order
        order.status = 'PAID'
        order.save()
    except Payment.DoesNotExist:
        return HttpResponse("Không tìm thấy thanh toán", status=404)

    return HttpResponse("Thanh toán thành công! Cảm ơn bạn.")


def paypal_cancel_view(request):
    token = request.GET.get("token")
    if not token:
        return HttpResponse("Mã đơn hàng không có trong yêu cầu!", status=400)

    return HttpResponse("Thanh toán đã bị hủy bỏ! Bạn có thể thử lại và chọn phương thức khác", status=200)


class CartViewSet(viewsets.GenericViewSet):
    queryset = Cart.objects.filter(active=True).prefetch_related('details')
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_user_cart(self):
        cart, created = Cart.objects.get_or_create(
            user=self.request.user
        )
        return cart

    @action(methods=['get'], detail=False, url_path='my_cart')
    def my_cart(self, request):
        cart = self.get_user_cart()

        cart.total = sum([d.product.price * d.quantity for d in cart.details.all()])
        cart.save(update_fields=['total'])

        serializer = self.get_serializer(cart)
        return Response(serializer.data)

    @action(methods=['post'], detail=False, url_path='add_product')
    def add_product(self, request):
        cart = self.get_user_cart()
        product_id = request.data.get('product_id')
        try:
            quantity = int(request.data.get('quantity', 1))
        except ValueError:
            return Response({'error': 'Số lượng không hợp lệ.'}, status=status.HTTP_400_BAD_REQUEST)

        if not product_id:
            return Response({'error': 'Vui lòng cung cấp ID sản phẩm.'}, status=status.HTTP_400_BAD_REQUEST)
        if quantity <= 0:
            return Response({'error': 'Số lượng sản phẩm phải lớn hơn 0.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product = Product.objects.get(pk=product_id)
        except Product.DoesNotExist:
            return Response({'error': f'Sản phẩm với ID {product_id} không tồn tại.'})

        cart_detail, created = CartDetail.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={'quantity': quantity}
        )

        if not created:
            cart_detail.quantity = F('quantity') + quantity
            cart_detail.save(update_fields=['quantity'])
            cart_detail.refresh_from_db()

        cart.total = sum([d.product.price * d.quantity for d in cart.details.all()])
        cart.save(update_fields=['total'])

        return Response(
            CartDetailSerializer(cart_detail).data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
        )

    @action(methods=['delete'], detail=False, url_path='remove_product')
    def remove_product(self, request):
        cart = self.get_user_cart()
        product_id = request.data.get('product_id')

        if not product_id:
            return Response({'error': 'Vui lòng cung cấp ID sản phẩm.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cart_detail = CartDetail.objects.get(cart=cart, product__id=product_id)
            cart_detail.delete()
        except CartDetail.DoesNotExist:
            return Response({'error': 'Sản phẩm không tồn tại trong giỏ hàng.'}, status=status.HTTP_404_NOT_FOUND)

        cart.total = sum([d.product.price * d.quantity for d in cart.details.all()])
        cart.save(update_fields=['total'])

        return Response({'message': 'Đã xoá sản phẩm khỏi giỏ hàng.'}, status=status.HTTP_200_OK)


class ShopRevenueStatsAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user

        if not user.is_shop_owner:
            return Response({'error': 'Bạn không có quyền truy cập'}, status=status.HTTP_403_FORBIDDEN)

        shop = getattr(user, 'shop', None)

        if not shop:
            return Response({'error': 'Không tìm thấy shop'}, status=status.HTTP_404_NOT_FOUND)

        year = int(request.query_params.get('year', datetime.now().year))
        month = request.query_params.get('month')
        quarter = request.query_params.get('quarter')

        orderdetails = OrderDetail.objects.filter(
            product__shop=shop,
            order__status='COMPLETED',
            created_date__year=year
        )

        if month:
            orderdetails = orderdetails.filter(created_date__month=int(month))

        if quarter:
            quarter = int(quarter)
            start_month = (quarter - 1) * 3 + 1
            end_month = start_month + 2
            orderdetails = orderdetails.filter(created_date__month__gte=start_month, created_date__month__lte=end_month)

        product_stats = orderdetails.values(name=F('product__name')).annotate(
            total_quantity=Sum('quantity'),
            total_revenue=Sum(F('quantity') * F('product__price'))
        ).order_by('-total_revenue')

        category_stats = orderdetails.values(name=F('product__category__name')).annotate(
            total_quantity=Sum('quantity'),
            total_revenue=Sum(F('quantity') * F('product__price'))
        ).order_by('-total_revenue')

        return Response({
            'product_stats': product_stats,
            'category_stats': category_stats
        })

class AdminShopStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not request.user.is_staff and not request.user.is_superuser:
            return Response({'error': 'Bạn không có quyền truy cập'}, status=status.HTTP_403_FORBIDDEN)

        shop_id = request.query_params.get('shop_id')
        if not shop_id:
            return Response({'error': 'Thiếu shop_id'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            shop = Shop.objects.get(id=shop_id)
        except Shop.DoesNotExist:
            return Response({'error': 'Không tìm thấy shop'}, status=status.HTTP_404_NOT_FOUND)

        year = int(request.query_params.get('year', datetime.now().year))
        month = request.query_params.get('month')
        quarter = request.query_params.get('quarter')

        try:

            orderdetails = OrderDetail.objects.filter(
                product__shop=shop,
                order__status='PAID',
                created_date__year=year
            )

            # if month:
            #     orderdetails = orderdetails.filter(created_date__month=int(month))

            if quarter:
                quarter = int(quarter)
                start_month = (quarter - 1) * 3 + 1
                end_month = start_month + 2
                orderdetails = orderdetails.filter(created_date__month__gte=start_month, created_date__month__lte=end_month)

            # Thống kê theo sản phẩm
            # product_stats = orderdetails.values(name=F('product__name')).annotate(
            #     total_quantity=Sum('quantity'),
            #     total_revenue=Sum(F('quantity') * F('product__price'))
            # ).order_by('-total_revenue')
            #
            # # Thống kê theo danh mục
            # category_stats = orderdetails.values(name=F('product__category__name')).annotate(
            #     total_quantity=Sum('quantity'),
            #     total_revenue=Sum(F('quantity') * F('product__price'))
            # ).order_by('-total_revenue')

            # Thống kê theo tháng (có thể lọc theo quý)
            monthly_orderdetails = OrderDetail.objects.filter(
                product__shop=shop,
                order__status='PAID',
                created_date__year=year
            )

            if quarter:
                monthly_orderdetails = monthly_orderdetails.filter(
                    created_date__month__gte=start_month,
                    created_date__month__lte=end_month
                )

            monthly_stats_raw = monthly_orderdetails.annotate(month=ExtractMonth('created_date')).values('month').annotate(
                total_quantity=Sum('quantity'),
                total_revenue=Sum(F('quantity') * F('product__price'))
            ).order_by('month')

            # Chuẩn hóa dữ liệu cho 12 tháng
            monthly_stats = []
            stats_dict = {item['month']: item for item in monthly_stats_raw}
            for m in range(1, 13):
                if quarter and (m < start_month or m > end_month):
                    continue  # Bỏ qua tháng không nằm trong quý được chọn
                monthly_stats.append({
                    'month': m,
                    'total_quantity': stats_dict.get(m, {}).get('total_quantity', 0),
                    'total_revenue': stats_dict.get(m, {}).get('total_revenue', 0)
                })

            return Response({
                # 'product_stats': product_stats,
                # 'category_stats': category_stats,
                'monthly_stats': monthly_stats
            })
        except Exception as e:
            return Response({'error': str(e)}, status=500)
