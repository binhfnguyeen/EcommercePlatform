import axios from "axios";

// const BASE_URL = process.env.REACT_APP_DOMAIN;

const BASE_URL="https://ecomsaletestapi.onrender.com/"

export const endpoints = {
    'categorys': '/categorys/',
    'users': '/users/',
    'user-by-id': (userId) => `/users/${userId}/`,
    'shops': '/shops/',
    'products': '/products/',
    'comments': '/comments/',
    'comment-detail': (commentId) => `/comments/${commentId}/`,
    'comment-reply': (commentId) => `/comments/${commentId}/reply/`,
    'comment-replies': (commentId) => `/comments/${commentId}/replies/`,
    'comment-like': (commentId)=>`/comments/${commentId}/like/`,
    'orders': '/orders/',
    'cancel-order': (orderId)=>`/orders/${orderId}/order_cancel/`,
    'history-orders': '/orders/history_orders/',
    'payments': '/payments/',
    'paypal-payment': (paymentId) => `/payments/${paymentId}/create_paypal_payment/`,
    'my-cart': '/carts/my_cart/',
    'add-cart': '/carts/add_product/',
    'remove-product-cart': '/carts/remove_product/',
    'token':'/o/token/',
    'current_user':'/users/current-user/',
    'product': (productId) => `/products/${productId}/`,
    'product-comments': (productId)=>`/products/${productId}/comments/`,
    'product-compare': (productId) => `/products/${productId}/compare/`,
    'my-shop':'/shops/my_shop/',
    'shop-detail':(shopId)=>`/shops/${shopId}/products/`,
    'create-product':(shopId)=>`/shops/${shopId}/create_product/`,
    'shop-stat':'/shop/stats/',
    'admin-stat':'/adminshop/stats/',
    'user-unapproved':'/users/unapproved-user/',
    'approve-user':"/users/approved-user/"
}

export const authApis=(token)=>{
    return axios.create({
        baseURL:BASE_URL,
        headers:{
            "Authorization":`Bearer ${token}`
        }
    })
}

export default axios.create({
    baseURL: BASE_URL
});