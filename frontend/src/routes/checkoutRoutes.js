import { redirect } from 'react-router-dom';
import { getCart, createOrder, deleteItem } from '../services/api';

export async function checkoutLoader() {
    try {
        const response = await getCart();
        return response.data;
    } catch (error) {
        console.error('Error loading cart:', error);
        return { items: [], subtotal: 0 };
    }
}

export async function checkoutAction({ request }) {
    const formData = await request.formData();
    const cartData = await getCart();

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);

    const orderData = {
        deliveryDetails: {
            fullName: formData.get('fullName'),
            contactNumber: formData.get('contactNumber'),
            street: formData.get('street'),
            apartment: formData.get('apartment'),
            city: formData.get('city'),
            mode: formData.get('deliveryMode'),
            date: deliveryDate  // Add the required date field
        },
        paymentMethod: formData.get('paymentMethod')
    };

    try {
        console.log('creating order...')
        await createOrder(orderData);
        console.log('created')

        for (const item of cartData.data.items) {
            console.log('deleting item..')
            await deleteItem(item.itemId.id);
        }
            console.log('success delete')

        return 0;
    } catch (error) {
        console.error('Error creating order:', error);
        return { error: 'Failed to create order' };
    }
}
