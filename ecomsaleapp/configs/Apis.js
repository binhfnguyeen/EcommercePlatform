import axios from "axios";

// const BASE_URL = process.env.REACT_APP_DOMAIN;

const BASE_URL="https://ecomsaletestapi.onrender.com/"

export const endpoints = {
    'categorys': '/categorys/',
    'users': '/users/',
    'shops': '/shops/',
    'products': '/products/',
    'comments': '/comments/',
    'orders': '/orders/',
    'payments': '/payments/',
    'token':'/o/token/',
    'current_user':'/users/current-user/',
<<<<<<< HEAD
    'product': (productId) => `/products/${productId}/`
=======
    'my-shop':'shops/my_shop/'
>>>>>>> 864d8600d1fb65b614430e91bb0899a7a0abf9a3
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