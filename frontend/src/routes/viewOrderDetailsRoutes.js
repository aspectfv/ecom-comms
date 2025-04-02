import { redirect } from 'react-router-dom';
import { getOrderById, updateOrder, updateItem } from '../services/api';

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
            // First, get the current order to access item IDs
            let orderResponse;
            
            // Only fetch the order details if we're completing the order
            if (status === 'completed') {
                orderResponse = await getOrderById(params.id);
                const order = orderResponse.data;
                
                // Check if there are items with originalItemId that need to be marked as sold
                if (order && order.items && order.items.length > 0) {
                    console.log(`Marking ${order.items.length} items as sold for completed order ${params.id}`);
                    
                    // Create array of promises to update all items to 'sold' status
                    const updatePromises = order.items
                        .filter(item => item.itemDetails && item.itemDetails.originalItemId)
                        .map(item => {
                            console.log(`Marking item ${item.itemDetails.originalItemId} as sold`);
                            return updateItem(item.itemDetails.originalItemId, { status: 'sold' });
                        });
                    
                    // Execute all updates in parallel
                    if (updatePromises.length > 0) {
                        try {
                            await Promise.all(updatePromises);
                            console.log(`Successfully marked ${updatePromises.length} items as sold`);
                        } catch (itemUpdateError) {
                            console.error('Error updating item status to sold:', itemUpdateError);
                            // Continue with order update even if item update fails
                        }
                    }
                }
            }
            
            // Now update the order status
            await updateOrder(params.id, { status });
            
            return redirect(`/${user.role}/order/${params.id}`);
        } catch (error) {
            console.error(`Error updating order status to ${status}:`, error);
            return { error: 'Failed to update order status' };
        }
    }
    
    return null;
};