import { redirect } from 'react-router-dom';
import { getCart, createOrder } from '../services/api';

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
        await createOrder(orderData);
        return 0;
    } catch (error) {
        console.error('Error creating order:', error);
        return { error: 'Failed to create order' };
    }
}
