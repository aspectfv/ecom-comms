import { getOrderById, updateOrder } from '../services/api';


export const viewOrderDetailsLoader = async ({ params }) => {
    try {
        const response = await getOrderById(params.id);
        return response.data;
    } catch (error) {
        console.error('Error loading item details:', error);
        throw new Response('Failed to load item details', { status: 500 });
    }
};

export const viewOrderDetailsAction = async ({ request, params }) => {
    const formData = await request.formData();
    const action = formData.get('action');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (action === 'markAsCompleted') {
        try {
            await updateOrder(params.id, { status: 'completed' });
            // Return to the same page to see the updated status
            return redirect(`/${user.role}/order/${params.id}`);
        } catch (error) {
            console.error('Error marking order as completed:', error);
            return { error: 'Failed to update order status' };
        }
    }
    
    return null;
};