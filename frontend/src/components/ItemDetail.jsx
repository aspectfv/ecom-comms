import { useState, useEffect } from 'react';
import { useLoaderData, Link, useNavigate } from 'react-router-dom';

export default function ItemDetail() {
    const item = useLoaderData();
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleAddToCart = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        // Redirect to cart page after adding to cart (assuming cart logic is handled elsewhere)
        navigate('/cart');
    };

    const handleBuyNow = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        // Redirect to checkout page (assuming cart addition is handled before checkout)
        navigate('/checkout');
    };

    if (!item) {
        return <div>Item not found</div>;
    }

    return (
        <div>
            <Link to="/">Back to Home</Link>
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
                <button onClick={handleBuyNow}>Buy Now</button>
                <button onClick={handleAddToCart}>Add to Cart</button>
            </div>
        </div>
    );
}
