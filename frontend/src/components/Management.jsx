import { Link, Outlet } from 'react-router-dom';

export default function Management() {
    const user = JSON.parse(localStorage.getItem('user')); // Get user data from localStorage

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/login'; // Redirect to login page
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
                    {/* Header with search and user info */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <form>
                                <input 
                                    type="text" 
                                    placeholder="Looking for an item?" 
                                />
                                <button type="submit">SEARCH</button>
                            </form>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div>
                                <p>{user?.fullName || user?.username || 'Staff'}</p>
                                <p>{user?.role || 'Staff'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Render child routes here (Sales/Inventory/AddNewListing) */}
                    <Outlet />
                </div>
            </div>
        </div>
    );
}