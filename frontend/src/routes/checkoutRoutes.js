import { getCart, createOrder, uploadImage, updateItem, getItemById } from '../services/api';
import { redirect } from 'react-router-dom';

export async function checkoutLoader({ request }) {
    try {
        // Check if this is a Buy Now checkout
        const url = new URL(request.url);
        const buyNowItemId = url.searchParams.get('buyNow');
        
        if (buyNowItemId) {
            // Handle direct purchase with Buy Now
            try {
                const itemResponse = await getItemById(buyNowItemId);
                const item = itemResponse.data;
                
                // Check if item is still available
                if (item.status !== 'available') {
                    throw new Error('Item not available for purchase');
                }
                
                // Just load the item without changing its status
                // Construct a cart-like structure with this single item
                return {
                    isBuyNow: true,
                    buyNowItemId: buyNowItemId,
                    items: [{
                        itemId: item
                    }],
                    subtotal: item.price
                };
            } catch (error) {
                console.error('Error loading buy now item:', error);
                // If there's an error, redirect to home
                throw redirect('/home');
            }
        }
        
        // Regular cart checkout
        const response = await getCart();
        
        // Just return the cart data without changing any item statuses
        return response.data;
    } catch (error) {
        console.error('Error loading cart:', error);
        return { items: [], subtotal: 0 };
    }
}

export async function checkoutAction({ request }) {
    const formData = await request.formData();
    let cartData;
    let isBuyNow = false;
    let buyNowItemId = null;
    let buyNowItem = null;
    
    try {
        // Get the URL and check for buyNow parameter
        const url = new URL(request.url);
        buyNowItemId = url.searchParams.get('buyNow');
        
        if (buyNowItemId) {
            isBuyNow = true;
            
            // Get the item details
            const itemResponse = await getItemById(buyNowItemId);
            buyNowItem = itemResponse.data;
            
            // Verify the item is still available
            if (buyNowItem.status !== 'available') {
                return {
                    error: 'This item is no longer available for purchase.',
                    values: formData
                };
            }
            
            // Mark the item as ordered here in the action
            await updateItem(buyNowItemId, { status: 'ordered' });
            console.log(`Buy Now item ${buyNowItemId} marked as ordered in checkout action`);
            
            // Get the updated item data
            const updatedItemResponse = await getItemById(buyNowItemId);
            buyNowItem = updatedItemResponse.data;
            
            // Create a cart-like structure for this item
            cartData = {
                items: [{
                    itemId: buyNowItem
                }]
            };
        } else {
            // Regular cart checkout - get cart data
            const response = await getCart();
            cartData = response.data;
            
            // Mark all items in the cart as "ordered" here in the action
            if (cartData && cartData.items && cartData.items.length > 0) {
                const itemsToUpdate = cartData.items.filter(item => 
                    item.itemId && item.itemId.status === 'available'
                );
                
                if (itemsToUpdate.length > 0) {
                    console.log(`Marking ${itemsToUpdate.length} cart items as ordered in checkout action`);
                    const updatePromises = itemsToUpdate.map(item => 
                        updateItem(item.itemId.id, { status: 'ordered' })
                    );
                    await Promise.all(updatePromises);
                    
                    // Refresh cart data to get updated item statuses
                    const refreshResponse = await getCart();
                    cartData = refreshResponse.data;
                }
            }
        }
    } catch (error) {
        console.error('Error fetching cart or buy now item:', error);
        cartData = { items: [] };
    }

    // Debug formData contents
    console.log("Checkout FormData contents:");
    formData.forEach((value, key) => {
        if (value instanceof File) {
            console.log(`${key}: File named ${value.name}, size: ${value.size} bytes, type: ${value.type}`);
        } else {
            console.log(`${key}: ${value}`);
        }
    });

    console.log("Cart data:", cartData);

    // First, check if any items are already sold (might have changed after we marked them as ordered)
    if (cartData && cartData.items && cartData.items.length > 0) {
        const unavailableItems = cartData.items.filter(item => 
            item.itemId && item.itemId.status === 'sold'
        );
        
        if (unavailableItems.length > 0) {
            // Do NOT revert items back to available - they're already ordered
            // Just inform the user about the unavailable items
            const itemNames = unavailableItems.map(item => item.itemId.name).join(', ');
            return {
                error: `The following items are no longer available: ${itemNames}. Please contact customer support.`,
                values: formData
            };
        }
    }

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

    // Add a flag for Buy Now orders
    if (isBuyNow) {
        orderData.isBuyNow = true;
        orderData.buyNowItemId = buyNowItemId;
    }

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
            
            // If we encounter an error with payment upload, revert the item status back to "available"
            if (isBuyNow && buyNowItemId) {
                // Revert just the buy now item
                try {
                    await updateItem(buyNowItemId, { status: 'available' });
                    console.log('Buy Now item status reverted to available after payment proof upload error');
                } catch (revertError) {
                    console.error('Error reverting Buy Now item status:', revertError);
                }
            } else if (cartData && cartData.items && cartData.items.length > 0) {
                // Revert cart items
                try {
                    const revertPromises = cartData.items.map(item => 
                        updateItem(item.itemId.id, { status: 'available' })
                    );
                    await Promise.all(revertPromises);
                    console.log('Item status reverted to available after payment proof upload error');
                } catch (revertError) {
                    console.error('Error reverting item status:', revertError);
                }
            }
            
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

        // The backend handles marking items as "sold" in the completed order 
        // and clears the cart for regular orders

        return 0;
    } catch (error) {
        console.error('Error creating order:', error);
        
        // Revert item status back to "available" on error
        if (isBuyNow && buyNowItemId) {
            // Revert just the buy now item
            try {
                await updateItem(buyNowItemId, { status: 'available' });
                console.log('Buy Now item status reverted to available after order creation error');
            } catch (revertError) {
                console.error('Error reverting Buy Now item status:', revertError);
            }
        } else if (cartData && cartData.items && cartData.items.length > 0) {
            // Revert cart items
            try {
                const revertPromises = cartData.items.map(item => 
                    updateItem(item.itemId.id, { status: 'available' })
                );
                await Promise.all(revertPromises);
                console.log('Item status reverted to available after order creation error');
            } catch (revertError) {
                console.error('Error reverting item status:', revertError);
            }
        }
        
        return { error: 'Failed to create order' };
    }
}
