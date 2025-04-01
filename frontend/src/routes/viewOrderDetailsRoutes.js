import { redirect } from 'react-router-dom';
import { getOrderById, updateOrder } from '../services/api';

export const viewOrderDetailsLoader = async ({ params }) => {
    try {
        const response = await getOrderById(params.id);
        return response.data;
    } catch (error) {
        console.error('Error loading order details:', error);
        throw new Response('Failed to load order details', { status: 500 });
    }
};

export const viewOrderDetailsAction = async ({ request, params }) => {
    const formData = await request.formData();
    const action = formData.get('action');
    const user = JSON.parse(localStorage.getItem('user'));
    
    // Map action types to properly formatted status values
    const statusMap = {
        'markAsOutForDelivery': 'out_for_delivery',
        'markAsReadyForPickup': 'ready_for_pickup',
        'markAsCompleted': 'completed',
        'markAsCancelled': 'cancelled'
    };
    
    const status = statusMap[action];
    
    if (status) {
        try {
            await updateOrder(params.id, { status });
            return redirect(`/${user.role}/order/${params.id}`);
        } catch (error) {
            console.error(`Error updating order status to ${status}:`, error);
            return { error: 'Failed to update order status' };
        }
    }
    
    return null;
};