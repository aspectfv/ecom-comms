import { useLoaderData, Link } from 'react-router-dom';

export default function ViewDetails() {
    const item = useLoaderData(); // Load item details from the loader
    const user = JSON.parse(localStorage.getItem('user')); // Get user data

    return (
        <div>
            <h1>Product</h1>
            
            <div>
                <div>
                    <div>
                        <p><strong>Item Code:</strong> {item.itemCode}</p>
                        <p><strong>Item Name:</strong> {item.name}</p>
                        <p><strong>Price:</strong> ${item.price.toFixed(2)}</p>
                        <p><strong>Owner:</strong> {item.owner}</p>
                        <p><strong>Type:</strong> {item.type === 'preloved' ? 'Pre-loved' : 'Brand New'}</p>
                        <p><strong>Category:</strong> {item.category}</p>
                    </div>
                    
                    <div>
                        <h3>Description</h3>
                        <p>{item.description || 'No description available'}</p>
                    </div>
                    
                    {item.type === 'preloved' && (
                        <div>
                            <h3>Condition</h3>
                            <p>{item.condition || 'No condition information available'}</p>
                        </div>
                    )}

                    <button type="button">Mark as Sold</button>
                </div>
            </div>
        </div>
    );
}