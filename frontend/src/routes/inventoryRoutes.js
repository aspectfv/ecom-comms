

import { getAllItems } from '../services/api';

export const inventoryLoader = async () => {
    const user = localStorage.getItem('user');
    if (!user) {
        throw new Response('Unauthorized', { status: 401 });
    }

    const { role } = JSON.parse(user);
    
    // Check if user has required role for this route
    if (role !== 'admin' && role !== 'staff') {
        throw new Response('Forbidden', { status: 403 });
    }

    try {
        // Use the existing getAllItems function instead of separate admin/staff inventory functions
        const response = await getAllItems();
        return response.data;
    } catch (error) {
        console.error('Error loading inventory items:', error);
        throw new Response('Failed to load items', { status: 500 });
    }
};