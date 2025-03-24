import { useLoaderData, Link, Form } from 'react-router-dom';

export default function ViewDetails() {
    const order = useLoaderData(); // Load order details from the loader
    const user = JSON.parse(localStorage.getItem('user')); // Get user data

    // Format date to be more readable
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div>
            <h1>Order Details</h1>
            
            <div style={{ marginBottom: '20px' }}>
                <Link to={`/${user.role}/orders`}>
                    <button>&larr; Back to Orders</button>
                </Link>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                    <h2>Order #{order.orderNumber}</h2>
                    <p><strong>Date:</strong> {formatDate(order.createdAt)}</p>
                </div>
                
                <div>
                    <div style={{ 
                        padding: '8px 16px',
                        borderRadius: '4px',
                        backgroundColor: order.status === 'completed' ? '#e6f7e9' : '#fff4e5',
                        color: order.status === 'completed' ? '#2e7d32' : '#ed6c02',
                        display: 'inline-block',
                        fontWeight: 'bold'
                    }}>
                        {order.status.toUpperCase()}
                    </div>
                    
                    {/* Only show Mark as Completed button if order is pending and user is admin */}
                    {order.status === 'pending' && user.role === 'admin' && (
                        <Form method="post">
                            <input type="hidden" name="action" value="markAsCompleted" />
                            <button 
                                type="submit"
                                style={{ 
                                    marginTop: '10px',
                                    backgroundColor: '#4caf50',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Mark as Completed
                            </button>
                        </Form>
                    )}
                </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                    <h3>Customer Information</h3>
                    <p><strong>Name:</strong> {order.deliveryDetails.fullName}</p>
                    <p><strong>Contact:</strong> {order.deliveryDetails.contactNumber}</p>
                    <p><strong>Address:</strong> {order.deliveryDetails.street}, {order.deliveryDetails.city}</p>
                </div>
                
                <div>
                    <h3>Order Information</h3>
                    <p><strong>Delivery Method:</strong> {order.deliveryDetails.mode}</p>
                    <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                    {order.completedAt && (
                        <p><strong>Completed Date:</strong> {formatDate(order.completedAt)}</p>
                    )}
                </div>
            </div>
            
            <h3>Order Items</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f5f5f5', textAlign: 'left' }}>
                        <th style={{ padding: '10px' }}>Item</th>
                        <th style={{ padding: '10px' }}>Price</th>
                        <th style={{ padding: '10px' }}>Quantity</th>
                        <th style={{ padding: '10px' }}>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {order.items.map((item, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '10px' }}>{item.itemId.name}</td>
                            <td style={{ padding: '10px' }}>${item.price.toFixed(2)}</td>
                            <td style={{ padding: '10px' }}>{item.quantity}</td>
                            <td style={{ padding: '10px' }}>${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan="3" style={{ textAlign: 'right', padding: '10px', fontWeight: 'bold' }}>Subtotal:</td>
                        <td style={{ padding: '10px' }}>${order.subtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colSpan="3" style={{ textAlign: 'right', padding: '10px', fontWeight: 'bold' }}>Total:</td>
                        <td style={{ padding: '10px', fontWeight: 'bold' }}>${order.total.toFixed(2)}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}