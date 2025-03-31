import { getItemById, addToCart } from '../services/api';

export async function viewItemDetailsLoader({ params }) {
    try {
        const response = await getItemById(params.id);
        return response.data;
    } catch (error) {
        console.error('Error loading item details:', error);
        throw new Response("Item not found", { status: 404 });
    }
}