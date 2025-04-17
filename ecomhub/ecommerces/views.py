from _ast import Or

import requests
from django.http import HttpResponse
from django.shortcuts import render
from django.utils.timezone import activate
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.templatetags.rest_framework import data
from urllib3 import request
from . import paginators
from . import perms
from . import serializers
from .models import Category, Product, Inventory, ProductImage, Shop, Cart, CartDetail, Comment, Discount, Order, \
    OrderDetail, Payment, User
from rest_framework import viewsets, permissions, generics, parsers, status
from rest_framework.decorators import action
from .serializers import CategorySerializer, UserSerializer, ShopSerializer, ProductSerializer, CommentSerializer, \
    ProductImageSerializer, OrderSerializer, OrderDetailWithProductSerializer, \
    PaymentSerializer
from django.conf import settings


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
                if k in ['first_name', 'last_name', 'avatar']:
                    setattr(u, k, v)
                elif k.__eq__('password'):
                    u.set_password(v)

            u.save()
            return Response(serializers.UserSerializer(u).data)

        return Response(serializers.UserSerializer(request.user).data)


class ShopViewSet(viewsets.ViewSet, generics.ListCreateAPIView, generics.RetrieveAPIView):
    queryset = Shop.objects.filter(active=True)
    serializer_class = ShopSerializer


class ProductViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Product.objects.filter(active=True).prefetch_related('images')
    serializer_class = ProductSerializer

    def get_permissions(self):
        if self.action.__eq__('get_comments'):
            if self.request.method.__eq__('POST'):
                return [permissions.IsAuthenticated()]
        elif self.action.__eq__('like'):
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    def get_object(self):
        return generics.get_object_or_404(self.queryset, pk=self.kwargs.get('pk'))

    @action(methods=['get', 'post'], url_path='comments', detail=True)
    def get_comments(self, request, pk):
        if request.method.__eq__('POST'):
            print(request.method)
            t = CommentSerializer(data={
                'content': request.data.get('content'),
                'user': request.user.pk,
                'product': pk,
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
    queryset = Comment.objects.filter(active=True)
    serializer_class = CommentSerializer
    permission_classes = [perms.CommentOwner]


class CommentViewSet(viewsets.ViewSet, generics.ListCreateAPIView):
    queryset = Comment.objects.filter(active=True)
    serializer_class = CommentSerializer


class ProductImageViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Product.objects.filter(active=True)
    serializer_class = ProductImageSerializer


class OrderViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView, generics.CreateAPIView):
    queryset = Order.objects.filter(active=True)
    serializer_class = OrderSerializer
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

    @action(methods=['delete'], detail=True, url_path='order_cancel', permission_classes=[permissions.IsAuthenticated])
    def cancel_order(self, request, pk):
        order = self.get_object()

        if order.user != request.user:
            return Response({'error': 'Bạn không có quyền truy cập đơn hàng này'}, status=status.HTTP_400_BAD_REQUEST)

        order.active = False
        order.save()

        return Response(OrderSerializer(order).data, status=status.HTTP_200_OK)

    @action(methods=['patch'], detail=True, url_path='update_address', permission_classes=[permissions.IsAuthenticated])
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

    @action(methods=['get'], detail=False, url_path='paypal-success')
    def paypal_success_callback(self, request):
        order_id = request.query_params.get('token')
        if not order_id:
            return Response({'error': 'Thiếu mã đơn hàng PayPal (token)'}, status=status.HTTP_400_BAD_REQUEST)

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

        capture_res = requests.post(
            f'https://api-m.sandbox.paypal.com/v2/checkout/orders/{order_id}/capture',
            headers=headers
        )

        if capture_res.status_code != 201:
            return Response({'error': 'Không thể xác nhận thanh toán PayPal'}, status=500)

        capture_data = capture_res.json()
        reference_id = capture_data['purchase_units'][0]['reference_id']
        order_pk = reference_id.replace("ORDER-", "")

        try:
            payment = Payment.objects.get(order__pk=order_pk)
            payment.status = True
            print(f"Đã thanh toán thành công Order có id {order_pk}")
            payment.save()
        except Payment.DoesNotExist:
            return Response({'error': 'Không tìm thấy thanh toán phù hợp trong hệ thống'}, status=404)

        return Response({'message': 'Đã xác nhận thanh toán thành công!'}, status=status.HTTP_200_OK)

    @action(methods=['get'], detail=False, url_path='paypal-cancel')
    def paypal_cancel_callback(self, request):
        token = request.query_params.get('token')

        if not token:
            return Response({"error": "Mã đơn hàng không có trong yêu cầu!"}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "Thanh toán đã bị hủy bỏ! Bạn có thể thử lại và chọn phương thức khác"},
                        status=status.HTTP_200_OK)
