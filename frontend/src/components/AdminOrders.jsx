import { useLoaderData, Link, useSearchParams } from 'react-router-dom';
import { useState } from 'react';

export default function AdminOrders() {
    const orders = useLoaderData(); // Load orders data from the loader
    const user = JSON.parse(localStorage.getItem('user')); // Get user data for role-based routing
    
    // Use search params for state persistence in URL
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Initialize states from URL params
    const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');
    const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || '');
    const [selectedPeriod, setSelectedPeriod] = useState(searchParams.get('period') || '');

    // Apply filters based on URL search params
    const filteredOrders = orders.filter(order => {
        // Search query filter - case insensitive search across multiple fields
        const searchQuery = searchParams.get('q') || '';
        const matchesSearch = !searchQuery || 
            order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.deliveryDetails.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (order.paymentMethod && order.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase()));
        
        // Status filter
        const statusParam = searchParams.get('status') || '';
        const matchesStatus = !statusParam || order.status === statusParam.toLowerCase();
        
        // Period filter
        const periodParam = searchParams.get('period') || '';
        const orderDate = new Date(order.createdAt);
        const now = new Date();
        let matchesPeriod = true;
        
        if (periodParam === 'Last 24 Hours') {
            const yesterday = new Date(now.setHours(now.getHours() - 24));
            matchesPeriod = orderDate >= yesterday;
        } else if (periodParam === 'Last 7 Days') {
            const lastWeek = new Date(now.setDate(now.getDate() - 7));
            matchesPeriod = orderDate >= lastWeek;
        } else if (periodParam === 'This Month') {
            const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            matchesPeriod = orderDate >= firstDayOfMonth;
        } else if (periodParam === 'This Year') {
            const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
            matchesPeriod = orderDate >= firstDayOfYear;
        }
        // All-Time doesn't need filtering
        
        return matchesSearch && matchesStatus && matchesPeriod;
    });

    // Handle search form submission
    const handleSearch = (e) => {
        e.preventDefault(); // Prevent page reload
        updateSearchParams('q', searchInput);
    };

    // Update a single search parameter
    const updateSearchParams = (key, value) => {
        const newParams = new URLSearchParams(searchParams);
        
        if (value && value !== '') {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        
        setSearchParams(newParams);
    };

    // Handle input changes
    const handleSearchInputChange = (e) => {
        setSearchInput(e.target.value);
    };

    // Handle status selection change
    const handleStatusChange = (e) => {
        const value = e.target.value === 'Status' ? '' : e.target.value;
        setSelectedStatus(value);
        updateSearchParams('status', value);
    };
    
    // Handle period selection change
    const handlePeriodChange = (e) => {
        const value = e.target.value === 'Period' ? '' : e.target.value;
        setSelectedPeriod(value);
        updateSearchParams('period', value);
    };
    
    // Clear all filters
    const handleClearFilters = () => {
        setSearchInput('');
        setSelectedStatus('');
        setSelectedPeriod('');
        setSearchParams({});
    };

    // Export orders data as CSV
    const handleExportList = () => {
        if (!filteredOrders || filteredOrders.length === 0) {
            alert('No orders data to export.');
            return;
        }

        // Generate CSV content
        const headers = ['ORDER NUMBER', 'CUSTOMER', 'DATE', 'TOTAL', 'STATUS'];
        const rows = filteredOrders.map(order => [
            order.orderNumber,
            order.deliveryDetails.fullName,
            new Date(order.createdAt).toLocaleDateString(),
            `$${order.total.toFixed(2)}`,
            order.status.toUpperCase()
        ]);

        const csvContent = [
            headers.join(','), // Add headers
            ...rows.map(row => row.join(',')) // Add rows
        ].join('\n');

        // Create a Blob and download the file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'orders_data.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            {/* Header with search and user info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <form onSubmit={handleSearch}>
                        <input 
                            type="text" 
                            placeholder="Search orders..." 
                            value={searchInput}
                            onChange={handleSearchInputChange}
                        />
                        <button type="submit">SEARCH</button>
                    </form>
                    {(searchParams.size > 0) && (
                        <button onClick={handleClearFilters} style={{ marginLeft: '10px' }}>
                            Clear Filters
                        </button>
                    )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div>
                        <p>{user?.fullName || user?.username || 'Admin'}</p>
                        <p>{user?.role || 'Admin'}</p>
                    </div>
                </div>
            </div>
            
            <h1>Orders</h1> 

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                    {/* Status dropdown */}
                    <select 
                        value={selectedStatus || 'Status'} 
                        onChange={handleStatusChange}
                    >
                        <option>Status</option>
                        <option>Pending</option>
                        <option>Completed</option>
                    </select>

                    {/* Period dropdown */}
                    <select 
                        value={selectedPeriod || 'Period'} 
                        onChange={handlePeriodChange}
                    >
                        <option>Period</option>
                        <option>Last 24 Hours</option>
                        <option>Last 7 Days</option>
                        <option>This Month</option>
                        <option>This Year</option>
                        <option>All-Time</option>
                    </select>
                </div>

                <div>
                    <button onClick={handleExportList}>Export List</button>
                </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>ORDER NUMBER</th>
                        <th>CUSTOMER</th>
                        <th>DATE</th>
                        <th>TOTAL</th>
                        <th>STATUS</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.orderNumber}</td>
                                <td>{order.deliveryDetails.fullName}</td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td>${order.total.toFixed(2)}</td>
                                <td style={{ 
                                    color: order.status === 'completed' ? 'green' : 'orange',
                                    fontWeight: 'bold'
                                }}>
                                    {order.status.toUpperCase()}
                                </td>
                                <td>
                                    <Link to={`/${user.role}/order/${order.id}`}>
                                        <button>👁️ View</button>
                                    </Link>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                                No orders found matching the selected filters.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}