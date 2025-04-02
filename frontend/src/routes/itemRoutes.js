import { redirect } from 'react-router-dom';
import { getItemById, addToCart, updateItem } from '../services/api';

export async function itemDetailLoader({ params }) {
    try {
        const response = await getItemById(params.id);
        return response.data;
    } catch (error) {
        console.error('Error loading item:', error);
        throw new Response("Item not found", { status: 404 });
    }
}

export async function itemDetailAction({ request, params }) {
    const formData = await request.formData();
    const actionType = formData.get('actionType');
    const itemId = params.id;

    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (!userData) {
        // Redirect to login if not logged in
        return redirect('/login');
    }

    const userId = JSON.parse(userData).id;

    try {
        // Check if the item is available
        const itemResponse = await getItemById(itemId);
        const item = itemResponse.data;
        
        if (item.status !== 'available') {
            return { error: 'This item is no longer available for purchase.' };
        }
        
        if (actionType === 'addToCart') {
            // Add the item to cart
            await addToCart({ itemId, userId });

            return null;
        } else if (actionType === 'buyNow') {
            // Redirect to checkout with buyNow parameter
            await addToCart({ itemId, userId });
            return redirect(`/checkout?buyNow=${itemId}`);
        }
    } catch (error) {
        // Handle any errors
        console.error('Action failed:', error);
        return { error: 'Failed to process your request. Please try again.' };
    }
}
