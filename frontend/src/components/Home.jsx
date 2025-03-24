import { useState, useEffect } from 'react';
import { Link, useLoaderData } from 'react-router-dom';

function ItemCard({ item }) {
    return (
        <div className="card">
            <div className="card-image">
                <img
                    src={item.images[0] || 'https://placehold.co/300x200?text=No+Image'}
                    height={200}
                    alt={item.name}
                />
            </div>

            <div className="card-content">
                <h3>{item.name}</h3>
                <p className="price">${item.price.toFixed(2)}</p>
            </div>
        </div>
    );
}

export default function Home() {
    const items = useLoaderData();
    const prelovedItems = items.filter(item => item.type === 'preloved');
    const brandnewItems = items.filter(item => item.type === 'brandnew');

    const [drawerOpened, setDrawerOpened] = useState(false);
    const [activeTab, setActiveTab] = useState('preloved');

    const toggleDrawer = () => setDrawerOpened(!drawerOpened);
    const closeDrawer = () => setDrawerOpened(false);

    return (
        <div>
            {/* Header */}
            <header className="header">
                <div className="header-content">
                    <div className="logo">
                        <h2>Merca Finds</h2>
                    </div>

                    <nav className="desktop-nav">
                        <Link to="/">Home</Link>
                        <Link to="/preloved">Pre-loved</Link>
                        <Link to="/brandnew">Brand New</Link>
                        <Link to="/about">About</Link>
                    </nav>

                    <div className="desktop-actions">
                        <button aria-label="Favorites">❤️</button>
                        <button aria-label="Shopping Cart">🛒</button>
                        <Link to="/login">Login</Link>
                    </div>

                    <button className="mobile-menu-button" onClick={toggleDrawer}>
                        ☰
                    </button>
                </div>
            </header>

            {/* Mobile Drawer */}
            {drawerOpened && (
                <div className="mobile-drawer">
                    <button className="close-button" onClick={closeDrawer}>✕</button>
                    <h3>Navigation</h3>
                    <hr />
                    <nav className="mobile-nav">
                        <Link to="/" onClick={closeDrawer}>Home</Link>
                        <Link to="/preloved" onClick={closeDrawer}>Pre-loved</Link>
                        <Link to="/brandnew" onClick={closeDrawer}>Brand New</Link>
                        <Link to="/about" onClick={closeDrawer}>About</Link>
                    </nav>
                    <hr />
                    <div className="mobile-actions">
                        <Link to="/login" onClick={closeDrawer}>Log in</Link>
                        <Link to="/signup" onClick={closeDrawer}>Sign up</Link>
                    </div>
                </div>
            )}

            {/* Main Content */}
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

            {/* Footer */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-grid">
                        <div className="footer-section">
                            <h3>Merca Finds</h3>
                            <p>by Mercadoria de Argila</p>
                            <p>The ultimate one-stop platform for discovering a curated selection of pre-owned and brand-new items</p>
                            <img src="https://placehold.co/100x50?text=Logo" alt="Merca Finds Logo" width={100} />
                        </div>

                        <div className="footer-section">
                            <h4>Support</h4>
                            <p>123 Market Street</p>
                            <p>San Francisco, CA 94103</p>
                        </div>

                        <div className="footer-section">
                            <h4>Contact</h4>
                            <p>exclusive@gmail.com</p>
                            <p>+1 (555) 123-4567</p>
                        </div>

                        <div className="footer-section">
                            <h4>Follow Us</h4>
                            <div className="social-links">
                                <button>📷</button>
                                <button>🐦</button>
                                <button>👥</button>
                            </div>
                        </div>
                    </div>

                    <hr />

                    <p className="copyright">© 2025 Merca Finds. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
