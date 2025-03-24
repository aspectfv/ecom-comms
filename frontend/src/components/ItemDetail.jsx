import { useState, useEffect } from 'react';
import { useLoaderData, Link, Form } from 'react-router-dom';

import Header from './Header'
import Footer from './Footer'

export default function ItemDetail() {
    const item = useLoaderData();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    if (!item) {
        return <div>Item not found</div>;
    }

    return (
        <div>
            <Header />
            <div>
                {item.images && item.images.length > 0 ? (
                    <img src={item.images[0]} alt={item.name} />
                ) : (
                    <div>No image available</div>
                )}
            </div>
            <h1>{item.name}</h1>
            <p>Category: {item.category || 'Uncategorized'}</p>
            <p>Type: {item.type === 'preloved' ? 'Pre-loved' : 'Brand New'}</p>
            <p>Price: ${item.price.toFixed(2)}</p>
            <div>
                <h2>Description</h2>
                <p>{item.description || 'No description available'}</p>
            </div>
            {item.type === 'preloved' && (
                <div>
                    <h3>Condition</h3>
                    <p>{item.condition || 'Condition not specified'}</p>
                </div>
            )}
            <div>
                <Form method="post">
                    <input type="hidden" name="actionType" value="buyNow" />
                    <button type="submit">Buy Now</button>
                </Form>
                <Form method="post">
                    <input type="hidden" name="actionType" value="addToCart" />
                    <button type="submit">Add to Cart</button>
                </Form>
            </div>
            <Footer />
        </div>
    );
}
