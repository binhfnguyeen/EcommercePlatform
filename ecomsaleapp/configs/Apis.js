import axios from "axios";

// const BASE_URL = process.env.REACT_APP_DOMAIN;

const BASE_URL="https://ecomsaletestapi.onrender.com/"

export const endpoints = {
    'categorys': '/categorys/',
    'users': '/users/',
    'shops': '/shops/',
    'products': '/products/',
    'comments': '/comments/',
    'comment-detail': (commentId) => `/comments/${commentId}/`,
    'comment-reply': (commentId) => `/comments/${commentId}/reply/`,
    'comment-replies': (commentId) => `/comments/${commentId}/replies/`,
    'orders': '/orders/',
    'payments': '/payments/',
    'token':'/o/token/',
    'current_user':'/users/current-user/',
    'product': (productId) => `/products/${productId}/`,
    'product-comments': (productId)=>`/products/${productId}/comments/`,
    'my-shop':'shops/my_shop/',
    'shop-detail':(shopId)=>`/shops/${shopId}/products/`,
    'create-product':(shopId)=>`/shops/${shopId}/create_product/`
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