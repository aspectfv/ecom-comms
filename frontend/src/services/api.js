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

// PROOFREAD TO

// Auth routes
export const register = (userData) => api.post('/auth/register', userData);
export const login = (email, password) => api.post('/auth/login', { email, password });
export const logout = () => api.get('/auth/logout');

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
export const updateCartItem = (itemId, updateData) => api.put(`/cart/update/${itemId}`, updateData);

// Order routes
export const createOrder = (orderData) => api.post('/orders', orderData);
export const getUserOrders = () => api.get('/orders/user');
export const getOrderById = (orderId) => api.get(`/orders/${orderId}`);
export const updateOrderStatus = (orderId, statusData) => api.put(`/orders/${orderId}/status`, statusData);

// Admin routes
export const getAdminInventory = () => api.get('/admin/inventory');
export const getAdminSales = () => api.get('/admin/sales');

// Sales routes
export const getAllSales = () => api.get('/sales');
export const filterSales = (filterParams) => api.get('/sales/filter', { params: filterParams });

// Staff routes
export const getStaffInventory = () => api.get('/staff/inventory');

export default api;
