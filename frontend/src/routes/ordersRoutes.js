import { getUserOrders } from "../services/api";

export async function ordersLoader() {
    try {
        const response = await getUserOrders();
        return response.data;
    } catch (error) {
        console.error("Error loading orders:", error);
        return { orders: [] };
    }
}
