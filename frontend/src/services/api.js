import axios from 'axios';

const BASE_URL = '/api';

// Create an axios instance with default headers
const api = axios.create({
    baseURL: BASE_URL
});

// Add an interceptor to include the auth token in all requests
api.interceptors.request.use(config => {
    const user = localStorage.getItem('user');
    const token = user ? JSON.parse(user).token : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth routes
export const register = (userData) => api.post('/auth/register', userData);
export const login = (email, password) => api.post('/auth/login', { email, password });

// Item routes
export const getAllItems = () => api.get('/items');
export const getItemById = (itemId) => api.get(`/items/${itemId}`);
export const createItem = (itemData) => api.post('/items', itemData);
export const updateItem = (itemId, itemData) => api.put(`/items/${itemId}`, itemData);
export const deleteItem = (itemId) => api.delete(`/items/${itemId}`);

// Cart routes
export const getCart = () => api.get('/cart');
export const addToCart = (itemData) => api.post('/cart/add', itemData);
export const removeFromCart = (itemId) => api.delete(`/cart/remove/${itemId}`);

// Order routes
export const getAllOrders = () => api.get('/orders'); 
export const createOrder = (orderData) => api.post('/orders', orderData);
export const getUserOrders = () => api.get('/orders/user');
export const getOrderById = (orderId) => api.get(`/orders/${orderId}`);
export const updateOrder = (orderId, updateData) => api.put(`/orders/${orderId}`, updateData);

// Upload routes
export const uploadImage = (formData) => api.post('/upload/image', formData);
export const uploadImages = (formData) => api.post('/upload/images', formData);

export default api;
