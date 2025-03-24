import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
    const navigate = useNavigate();
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
        <header className="header">
            <div className="header-content">
                <div className="logo">
                    <h2>Merca Finds</h2>
                </div>

                <nav className="desktop-nav">
                    <Link to="/">Home</Link>
                    {!user ? (
                        <Link to="/login">Login</Link>
                    ) : (
                        <>
                            <span>Hello, {user.fullName}</span>
                            {user.role === 'customer' && (
                                <div>
                                    <Link to="/cart">Shopping Cart</Link>
                                    <br />
                                    <Link to="/orders">Orders</Link>
                                </div>
                            )}
                            <button onClick={handleLogout}>Logout</button>
                        </>
                    )}
                </nav>

                <div className="desktop-actions">
                </div>
            </div>
        </header>
    );
}
