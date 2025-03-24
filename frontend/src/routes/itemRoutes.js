import { redirect } from 'react-router-dom';
import { getItemById, addToCart } from '../services/api';

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
        if (actionType === 'addToCart') {
            // Add the item to cart
            await addToCart({ itemId, quantity: 1, userId }); // Adjust quantity as needed

            // Return to same page
            return null;

        } else if (actionType === 'buyNow') {
            // Add to cart first (optional)
            await addToCart({ itemId, quantity: 1, userId });

            // Redirect to checkout
            return redirect('/checkout');
        }
    } catch (error) {
        // Handle any errors
        console.error('Action failed:', error);
        return null;
    }
}
