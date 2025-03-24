import { redirect } from 'react-router-dom';
import { getItemById, createItem } from '../services/api';

export const addNewListingAction = async ({ request }) => {
    try {
        const formData = await request.formData();
        const itemData = {
            itemCode: formData.get('itemCode'),
            name: formData.get('name'),
            price: Number(formData.get('price')),
            owner: formData.get('owner'),
            type: formData.get('type'),
            category: formData.get('category'),
            description: formData.get('description'),
            condition: formData.get('condition') || undefined,
        };

        // Quick validation of essential numeric fields
        if (isNaN(itemData.price) || itemData.price <= 0) {
            return { 
                error: 'Price must be a valid positive number',
                values: itemData 
            };
        }
        
        // Get the user's role to determine where to redirect after successful creation
        const user = JSON.parse(localStorage.getItem('user'));
        
        // Send the API request to create the item
        const response = await createItem(itemData);
        
        // Redirect to the view details page for the newly created item
        return redirect(`/${user.role}/item/${response.data.id}`);
    } catch (error) {
        console.error('Error creating item:', error);
        return { error: error.response?.data?.message || 'Failed to create item' };
    }
};