import { useLoaderData } from "react-router-dom";
import { useEffect } from "react";

function Orders() {
    const orders = useLoaderData();
    return (
        <div>
            <h1>Your Orders</h1>

            {orders.length === 0 ? (
                <p>You don't have any orders yet.</p>
            ) : (
                <ul>
                    {orders.map(order => (
                        <li key={order.id}>
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
                            <hr />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Orders;
