import { getItemById } from '../services/api';

export async function itemDetailLoader({ params }) {
    try {
        const response = await getItemById(params.id);
        return response.data;
    } catch (error) {
        console.error('Error loading item:', error);
        throw new Response("Item not found", { status: 404 });
    }
}
