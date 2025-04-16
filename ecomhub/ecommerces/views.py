from _ast import Or
from django.shortcuts import render
from django.utils.timezone import activate
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from urllib3 import request
from . import paginators
from . import perms
from . import serializers
from .models import Category, Product, Inventory, ProductImage, Shop, Cart, CartDetail, Comment, Discount, Order, \
    OrderDetail, Payment, User
from rest_framework import viewsets, permissions, generics, parsers, status
from rest_framework.decorators import action
from .serializers import CategorySerializer, UserSerializer, ShopSerializer, ProductSerializer, CommentSerializer, \
    ProductImageSerializer, OrderSerializer, OrderDetailWithOrderSerializer, OrderDetailWithProductSerializer, \
    PaymentSerializer


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

    @action(methods=['get'], detail=True, url_path='order-details')
    def get_order_details(self, request, pk):
        product = self.get_object()
        orderdetails = product.orderdetails.filter(active=True)
        return Response(OrderDetailWithOrderSerializer(orderdetails, many=True).data, status=status.HTTP_200_OK)


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


class OrderViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
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
    permission_classes = [perms.PaymentOwner]

    def get_queryset(self):
        query = self.queryset
        if self.action.__eq__('list'):
            id = self.request.query_params.get('id')
            if id:
                query = query.filter(id=id)
        return query
