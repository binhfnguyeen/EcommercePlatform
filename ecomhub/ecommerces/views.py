from django.shortcuts import render
from django.utils.timezone import activate
from rest_framework.response import Response
from urllib3 import request
from . import paginators
from . import perms

from .models import Category,Product,Inventory,ProductImage,Shop,Cart,CartDetail,Comment,Discount,Order,OrderDetail,Payment,User
from rest_framework import viewsets, permissions, generics,parsers,status
from rest_framework.decorators import action
from .serializers import CategorySerializer, UserSerializer, ShopSerializer, ProductSerializer, CommentSerializer, \
    ProductImageSerializer


class CategoryViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Category.objects.filter(active=True)
    serializer_class = CategorySerializer

class UserViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializer
    parser_classes = [parsers.MultiPartParser,]

class ShopViewSet(viewsets.ViewSet, generics.ListCreateAPIView,generics.RetrieveAPIView):
    queryset = Shop.objects.filter(active=True)
    serializer_class = ShopSerializer

class ProductViewSet(viewsets.ViewSet,generics.ListAPIView,generics.RetrieveAPIView):
    queryset = Product.objects.filter(active=True).prefetch_related('images')
    serializer_class = ProductSerializer
    def get_permissions(self):
        if self.action.__eq__('get_comments'):
            if self.request.method.__eq__('POST'):
                return [permissions.IsAuthenticated()]
        elif self.action.__eq__('like'):
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

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



class CommentViewSet(viewsets.ViewSet,generics.ListCreateAPIView):
    queryset = Comment.objects.filter(active=True)
    serializer_class = CommentSerializer

class ProductImageViewSet(viewsets.ViewSet,generics.ListAPIView):
    queryset = Product.objects.filter(active=True)
    serializer_class = ProductImageSerializer