import { getAllItems } from '../services/api';

export const homeLoader = async () => {
    try {
        const response = await getAllItems();
        return response.data;
    } catch (error) {
        console.error("Failed to load items:", error);
        return [];
    }
};
