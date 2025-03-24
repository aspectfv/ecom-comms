import { Link, Outlet } from 'react-router-dom';

export default function Management() {
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
            <div style={{ display: 'flex' }}>
                {/* Sidebar */}
                <div style={{ width: '180px', borderRight: '1px solid #e0e0e0', height: '100vh' }}>
                    <div>
                        <h2>Merca Finds</h2>
                        <p>{user.role} Panel</p>
                    </div>

                    {/* Conditional rendering for sidebar items based on user role */}
                    <div>
                        <div>
                            <Link to={`/${user.role}/inventory`}>Inventory</Link>
                        </div>

                        {/* Only admin can see Sales */}
                        {user && user.role === 'admin' && (
                            <div>
                                <Link to="/admin/sales">Sales</Link>
                            </div>
                        )}
                    </div>

                    <div style={{ marginTop: 'auto' }}>
                        <button onClick={handleLogout}>Log Out</button>
                    </div>
                </div>

                {/* Main Content */}
                <div style={{ flex: 1, padding: '20px' }}>
                    <Outlet /> {/* Render child routes here */}
                </div>
            </div>
        </div>
    );
}