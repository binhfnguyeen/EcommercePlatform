import axios from "axios"

const BASE_URL = process.env.REACT_APP_DOMAIN;

export const endpoints = {
    'categorys': '/categorys/',
    'users': '/users/',
    'shops': '/shops/',
    'products': '/products/',
    'comments': '/comments/',
    'orders': '/orders/',
    'payments': '/payments/'
}

export default axios.create({
    baseURL: BASE_URL
});