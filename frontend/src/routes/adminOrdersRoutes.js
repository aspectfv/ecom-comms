import { getAllOrders } from '../services/api';

export const adminOrdersLoader = async () => {
    const user = localStorage.getItem('user');
    if (!user) {
        throw new Response('Unauthorized', { status: 401 });
    }

    const { role } = JSON.parse(user);
    
    // Check if user has required role for this route
    if (role !== 'admin') {
        throw new Response('Forbidden', { status: 403 });
    }

    try {
        const response = await getAllOrders();
        return response.data;
    } catch (error) {
        console.error('Error loading orders:', error);
        throw new Response('Failed to load orders', { status: 500 });
    }
};
