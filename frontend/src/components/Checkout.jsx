import { useLoaderData, Form } from 'react-router-dom';

function Checkout() {
    const { items = [] } = useLoaderData();

    // Calculate subtotal here
    const subtotal = items.reduce((total, item) =>
        total + (item.itemId.price * item.quantity), 0);

    return (
        <div>
            <h1>Checkout</h1>
            <div>
                <h2>Your Items</h2>
                <ul>
                    {items.map((item) => (
                        <li key={item.itemId.id}>
                            {item.itemId.name} - ${item.itemId.price.toFixed(2)} x {item.quantity}
                        </li>
                    ))}
                </ul>
                <p>Subtotal: ${subtotal.toFixed(2)}</p>
                <p>Total: ${subtotal.toFixed(2)}</p>
            </div>
            <Form method="post">
                <h2>Delivery Information</h2>
                <div>
                    <label htmlFor="fullName">Full Name:</label>
                    <input type="text" id="fullName" name="fullName" required />
                </div>
                <div>
                    <label htmlFor="contactNumber">Contact Number:</label>
                    <input type="tel" id="contactNumber" name="contactNumber" required />
                </div>
                <div>
                    <label htmlFor="street">Street Address:</label>
                    <input type="text" id="street" name="street" required />
                </div>
                <div>
                    <label htmlFor="apartment">Apartment, Floor, etc. (optional):</label>
                    <input type="text" id="apartment" name="apartment" />
                </div>
                <div>
                    <label htmlFor="city">Town/City:</label>
                    <input type="text" id="city" name="city" required />
                </div>
                <div>
                    <label htmlFor="deliveryMode">Mode of Delivery:</label>
                    <select id="deliveryMode" name="deliveryMode" required>
                        <option value="pickup">Pickup</option>
                        <option value="delivery">Delivery</option>
                    </select>
                </div>
                <h2>Payment Method</h2>
                <div>
                    <label>
                        <input type="radio" name="paymentMethod" value="e-wallet" required /> E-Wallet
                    </label>
                    <label>
                        <input type="radio" name="paymentMethod" value="bank-transfer" /> Bank Transfer
                    </label>
                    <label>
                        <input type="radio" name="paymentMethod" value="cash" /> Cash
                    </label>
                </div>
                <button type="submit">Place Order</button>
            </Form>
        </div>
    );
}

export default Checkout;
