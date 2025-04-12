from django.urls import path, include, re_path
from . import views
from rest_framework import routers, permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

router = routers.DefaultRouter()
router.register('category', views.CategoryViewSet)
router.register('user', views.UserViewSet)
router.register('shop', views.ShopViewSet)
router.register('product', views.ProductViewSet)
router.register('comment', views.CommentViewSet)
router.register('order', views.OrderViewSet)

schema_view = get_schema_view(
    openapi.Info(
        title="EcomSale API",
        default_version='v1',
        description="APIs for EcomSaleApp",
        contact=openapi.Contact(email="nguyenchau16112004@gmail.com"),
        license=openapi.License(name="Châu Bình Nguyên@2025"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('', include(router.urls)),
    re_path(r'^swagger(?P<format>\.json|\.yaml)$',
            schema_view.without_ui(cache_timeout=0),
            name='schema-json'),
    re_path(r'^swagger/$',
            schema_view.with_ui('swagger', cache_timeout=0),
            name='schema-swagger-ui'),
    re_path(r'^redoc/$',
            schema_view.with_ui('redoc', cache_timeout=0),
            name='schema-redoc')
]
