import axios from 'axios';

export const api = axios.create({
    baseURL: process.env.REACT_APP_BACKEND
});

function authRequestInterceptor(config) {
    config.headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': '*',
        Authorization: `Bearer ${window.localStorage.getItem("token")}`
    };
    return config;
}

const errorHandler = (error) => {
    const statusCode = error.response?.status

    if (!error?.response) {
        console.log('El servidor no responde');
    } else if (statusCode === 401) {
        console.log('Contraseña o usuario incorrecto');
    } else if (statusCode === 402) {
        console.log('No tiene autorización');
    }

    return Promise.reject(error);
}

api.interceptors.request.use(authRequestInterceptor);
api.interceptors.response.use(undefined, (error) => {
    return errorHandler(error);
})

