import { getCart } from '../services/api';

export async function cartLoader() {
    try {
        const cart = await getCart();
        return cart.data;
    } catch (error) {
        throw error;
    }
}
