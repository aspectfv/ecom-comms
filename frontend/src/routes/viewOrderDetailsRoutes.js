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
    
    if (action === 'markAsOutForDelivery') {
        try {
            await updateOrder(params.id, { status: 'out_for_delivery' });
            return redirect(`/${user.role}/order/${params.id}`);
        } catch (error) {
            console.error('Error marking order as out for delivery:', error);
            return { error: 'Failed to update order status' };
        }
    } else if (action === 'markAsCompleted') {
        try {
            await updateOrder(params.id, { status: 'completed' });
            return redirect(`/${user.role}/order/${params.id}`);
        } catch (error) {
            console.error('Error marking order as completed:', error);
            return { error: 'Failed to update order status' };
        }
    }
    
    return null;
};