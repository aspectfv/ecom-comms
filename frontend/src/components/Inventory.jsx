import { useLoaderData, Link } from 'react-router-dom';

export default function Inventory() {
    const inventoryItems = useLoaderData(); // Load inventory items from the loader
    const user = JSON.parse(localStorage.getItem('user')); // Get user data for role-based routing

    // Export inventory items as CSV
    const handleExportList = () => {
        if (!inventoryItems || inventoryItems.length === 0) {
            alert('No items to export.');
            return;
        }

        // Generate CSV content
        const headers = ['ITEM CODE', 'ITEM NAME', 'CATEGORY', 'TYPE', 'PRICE', 'OWNER'];
        const rows = inventoryItems.map(item => [
            item.itemCode,
            item.name,
            item.category,
            item.type === 'preloved' ? 'Pre-loved' : 'Brand New',
            `$${item.price.toFixed(2)}`,
            item.owner
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
        link.setAttribute('download', 'inventory_list.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            {/* Inventory heading and controls */}
            <div>
                <h1>Inventory</h1> 

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div>
                        <select>
                            <option>Category</option>
                            <option>Sports & Outdoor</option>
                            <option>Electronics</option>
                            <option>Kids' Costumes</option>
                            <option>Toys & Games</option>
                            <option>Others</option>
                            <option>Adult Clothing</option>
                            <option>School & Office</option>
                            <option>Home & Lifestyle</option>
                        </select>

                        {/* Only show Status dropdown for admin users */}
                        {user && user.role === 'admin' && (
                            <select>
                                <option>Status</option>
                                <option>Active</option>
                                <option>Sold</option>
                            </select>
                        )}
                    </div>

                    <div>
                        <button onClick={handleExportList}>Export List</button>
                        <Link to={`/${user.role}/add-new-listing`}>
                            <button>Add New Listing</button>
                        </Link>
                    </div>
                </div>

                {/* Inventory Table */}
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th>ITEM CODE</th>
                            <th>ITEM NAME</th>
                            <th>CATEGORY</th>
                            <th>TYPE</th>
                            <th>PRICE</th>
                            <th>OWNER</th>
                            <th>VIEW DETAILS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventoryItems.map(item => (
                            <tr key={item.id}>
                                <td>{item.itemCode}</td>
                                <td>{item.name}</td>
                                <td>{item.category}</td>
                                <td>{item.type === 'preloved' ? 'Pre-loved' : 'Brand New'}</td>
                                <td>${item.price.toFixed(2)}</td>
                                <td>{item.owner}</td>
                                <td>
                                    <Link to={`/${user.role}/item/${item.id}`}>
                                        <button>👁️</button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}