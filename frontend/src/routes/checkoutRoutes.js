import { redirect } from 'react-router-dom';
import { getCart, createOrder, deleteItem, uploadImage } from '../services/api';

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

    // Debug formData contents
    console.log("Checkout FormData contents:");
    formData.forEach((value, key) => {
        if (value instanceof File) {
            console.log(`${key}: File named ${value.name}, size: ${value.size} bytes, type: ${value.type}`);
        } else {
            console.log(`${key}: ${value}`);
        }
    });

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
            date: deliveryDate
        },
        paymentMethod: formData.get('paymentMethod')
    };

    // Handle payment proof upload for e-wallet payment method
    const paymentProofFile = formData.get('paymentProof');
    if (orderData.paymentMethod === 'e-wallet' && 
        paymentProofFile && 
        paymentProofFile instanceof File && 
        paymentProofFile.size > 0) {
        
        try {
            // Create FormData for uploading the payment proof
            const proofFormData = new FormData();
            proofFormData.append('image', paymentProofFile);
            
            // Upload the payment proof image
            const response = await uploadImage(proofFormData);
            
            // Add payment proof URL to the order data using the correct structure
            orderData.paymentDetails = {
                proofImage: response.data.imageUrl,
                paymentDate: new Date()
            };
            console.log('Payment proof uploaded:', response.data.imageUrl);
        } catch (error) {
            console.error('Error uploading payment proof:', error);
            return { 
                error: 'Failed to upload payment proof. Please try again.',
                values: orderData 
            };
        }
    }

    try {
        console.log('Creating order with data:', orderData);
        const orderResponse = await createOrder(orderData);
        console.log('Order created successfully:', orderResponse.data);

        // Clear cart after successful order
        for (const item of cartData.data.items) {
            console.log('Removing item from cart:', item.itemId.id);
            await deleteItem(item.itemId.id);
        }
        console.log('Cart cleared successfully');

        return 0;
    } catch (error) {
        console.error('Error creating order:', error);
        return { error: 'Failed to create order' };
    }
}
