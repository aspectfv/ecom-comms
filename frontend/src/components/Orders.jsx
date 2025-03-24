import { useLoaderData } from "react-router-dom";
import { useState } from "react";

function Orders() {
    const orders = useLoaderData();
    const [selectedOrder, setSelectedOrder] = useState(null);

    const openOrderDetails = (order) => {
        setSelectedOrder(order);
    };

    const closeOrderDetails = () => {
        setSelectedOrder(null);
    };

    return (
        <div>
            <h1>Your Orders</h1>

            {orders.length === 0 ? (
                <p>You don't have any orders yet.</p>
            ) : (
                <ul>
                    {orders.map(order => (
                        <li key={order.id}>
                            <button
                                onClick={() => openOrderDetails(order)}
                                style={{ display: "block", width: "100%", textAlign: "left", cursor: "pointer" }}
                            >
                                <div>
                                    <strong>Order #:</strong> {order.orderNumber}
                                </div>
                                <div>
                                    <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
                                </div>
                                <div>
                                    <strong>Total:</strong> ${order.total.toFixed(2)}
                                </div>
                                <div>
                                    <strong>Status:</strong> {order.status}
                                </div>
                            </button>
                            <hr />
                        </li>
                    ))}
                </ul>
            )}

            {selectedOrder && (
                <div>
                    <div>
                        <h2>Order Details (#{selectedOrder.orderNumber})</h2>
                        <button onClick={closeOrderDetails}>Close</button>

                        <h3>Customer Information</h3>
                        <div>
                            <p><strong>Full Name:</strong> {selectedOrder.deliveryDetails.fullName}</p>
                            <p><strong>Contact Number:</strong> {selectedOrder.deliveryDetails.contactNumber}</p>
                            <p><strong>Street Address:</strong> {selectedOrder.deliveryDetails.street}</p>
                            <p><strong>Town/City:</strong> {selectedOrder.deliveryDetails.city}</p>
                        </div>

                        <h3>Delivery Information</h3>
                        <p><strong>Mode of Delivery:</strong> {selectedOrder.deliveryDetails.mode}</p>
                        <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>

                        <h3>Items</h3>
                        <ul>
                            {selectedOrder.items.map((item, index) => (
                                <li key={index}>
                                    <p>
                                        {item.itemId.name || "Item"} - Quantity: {item.quantity} - Price: ${item.price.toFixed(2)}
                                    </p>
                                </li>
                            ))}
                        </ul>

                        <div>
                            <p><strong>Subtotal:</strong> ${selectedOrder.subtotal.toFixed(2)}</p>
                            <p><strong>Total:</strong> ${selectedOrder.total.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Orders;
