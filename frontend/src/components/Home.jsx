import { useState, useEffect } from 'react';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import Header from './Header'
import Footer from './Footer'

function ItemCard({ item }) {
    // Function to properly format image URLs
    const getImageUrl = (imagePath) => {
        if (!imagePath) return 'https://placehold.co/300x200?text=No+Image';
        
        // If it's already a complete URL, return it as is
        if (imagePath.startsWith('http')) return imagePath;
        
        // Otherwise, prepend the backend URL
        return `http://localhost:3000${imagePath}`;
    };

    return (
        <Link to={`/item/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="card">
                <div className="card-image">
                    <img
                        src={item.images?.length ? getImageUrl(item.images[0]) : 'https://placehold.co/300x200?text=No+Image'}
                        height={200}
                        alt={item.name}
                    />
                </div>

                <div className="card-content">
                    <h3>{item.name}</h3>
                    <p className="price">${item.price.toFixed(2)}</p>
                </div>
            </div>
        </Link>
    );
}
export default function Home() {
    const items = useLoaderData();
    const prelovedItems = items.filter(item => item.type === 'preloved');
    const brandnewItems = items.filter(item => item.type === 'brandnew');
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('preloved');
    const [user, setUser] = useState(null);

    // Check localStorage for user data on component mount
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/home');
    };

    return (
        <div>
            <Header />

            <main className="container">
                <h1 className="page-title">Welcome to Merca Finds!</h1>

                <section>
                    <h2>Categories</h2>
                    <div className="tabs">
                        <div className="tab-list">
                            <button
                                className={activeTab === 'preloved' ? 'active' : ''}
                                onClick={() => setActiveTab('preloved')}
                            >
                                Pre-loved Items
                            </button>
                            <button
                                className={activeTab === 'brandnew' ? 'active' : ''}
                                onClick={() => setActiveTab('brandnew')}
                            >
                                Brand New Products
                            </button>
                        </div>

                        {activeTab === 'preloved' && (
                            <div className="tab-panel">
                                <div className="item-grid">
                                    {prelovedItems.map(item => (
                                        <ItemCard key={item.id} item={item} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'brandnew' && (
                            <div className="tab-panel">
                                <div className="item-grid">
                                    {brandnewItems.map(item => (
                                        <ItemCard key={item.id} item={item} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                <section>
                    <h2>Pre-loved Items</h2>
                    <div className="item-grid">
                        {prelovedItems.slice(0, 4).map(item => (
                            <ItemCard key={item.id} item={item} />
                        ))}
                    </div>
                </section>

                <section>
                    <h2>Brand New Products</h2>
                    <div className="item-grid">
                        {brandnewItems.slice(0, 4).map(item => (
                            <ItemCard key={item.id} item={item} />
                        ))}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
