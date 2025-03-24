import { useLoaderData, useNavigate } from 'react-router-dom';
import { removeFromCart } from '../services/api';

function Cart() {
    const cartData = useLoaderData();
    const items = cartData.items || [];

    const subtotal = items.reduce((total, item) =>
        total + (item.quantity * item.itemId.price), 0);

    const navigate = useNavigate();

    const handleRemove = async (cartItemId) => {
        try {
            console.log(cartItemId)
            await removeFromCart(cartItemId);
            navigate(0);
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    return (
        <div>
            <h2>Shopping Cart</h2>
            {items.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            // Remove spaces between <tr> and its children
                            <tr key={item._id}>
                                <td>{item.itemId.name}</td>
                                <td>${item.itemId.price.toFixed(2)}</td>
                                <td>{item.quantity}</td>
                                <td>${(item.quantity * item.itemId.price).toFixed(2)}</td>
                                <td>
                                    <button
                                        onClick={() => handleRemove(item.itemId.id)}
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {items.length > 0 && (
                <div>
                    Subtotal: ${subtotal.toFixed(2)}
                    <button onClick={() => navigate('/orders')}>Proceed to Checkout</button>
                </div>
            )}
        </div>
    );
}

export default Cart;
