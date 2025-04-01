import { getAllOrders } from '../services/api';

export const salesLoader = async () => {
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
        // Get all orders - we'll filter for completed ones in the component
        const response = await getAllOrders();
        return response.data;
    } catch (error) {
        console.error('Error loading orders for sales statistics:', error);
        throw new Response('Failed to load sales data', { status: 500 });
    }
};