import { useLoaderData, Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { deleteItem } from '../services/api';

export default function Inventory() {
    const inventoryItems = useLoaderData(); // Load inventory items from the loader
    const user = JSON.parse(localStorage.getItem('user')); // Get user data for role-based routing
    const navigate = useNavigate();
    
    // Use search params for state persistence in URL
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Initialize states from URL params
    const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
    const [isDeleting, setIsDeleting] = useState(false); // Track delete operation state

    // Extract unique categories from inventory items
    const categories = ['Category', ...new Set(inventoryItems.map(item => item.category))].filter(Boolean);

    // Apply filters based on URL search params
    const filteredItems = inventoryItems.filter(item => {
        // Search query filter - case insensitive search across multiple fields
        const searchQuery = searchParams.get('q') || '';
        const matchesSearch = !searchQuery || 
            item.itemCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.owner.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Category filter
        const categoryParam = searchParams.get('category') || '';
        const matchesCategory = !categoryParam || item.category === categoryParam;
        
        return matchesSearch && matchesCategory;
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

    // Handle category selection change
    const handleCategoryChange = (e) => {
        const value = e.target.value === 'Category' ? '' : e.target.value;
        setSelectedCategory(value);
        updateSearchParams('category', value);
    };

    // Export inventory items as CSV
    const handleExportList = () => {
        if (!filteredItems || filteredItems.length === 0) {
            alert('No items to export.');
            return;
        }

        // Generate CSV content
        const headers = ['ITEM CODE', 'ITEM NAME', 'CATEGORY', 'TYPE', 'PRICE', 'OWNER'];
        const rows = filteredItems.map(item => [
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

    // Clear all filters
    const handleClearFilters = () => {
        setSearchInput('');
        setSelectedCategory('');
        setSearchParams({}); // Clear all search params
    };

    // Handle item deletion
    const handleDeleteItem = async (itemId, itemName) => {
        // Confirm deletion
        if (!window.confirm(`Are you sure you want to delete "${itemName}"?`)) {
            return;
        }
        
        try {
            setIsDeleting(true);
            await deleteItem(itemId);
            // Refresh the page to update the list
            navigate(0);
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Failed to delete item. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div>
            {/* Header with search and user info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <form onSubmit={handleSearch}>
                        <input 
                            type="text" 
                            placeholder="Looking for an item?" 
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
                        <p>{user?.fullName || user?.username || 'Staff'}</p>
                        <p>{user?.role || 'Staff'}</p>
                    </div>
                </div>
            </div>

            {/* Inventory heading and controls */}
            <div>
                <h1>Inventory</h1> 

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div>
                        {/* Dynamic category dropdown */}
                        <select 
                            value={selectedCategory || 'Category'} 
                            onChange={handleCategoryChange}
                        >
                            {categories.map((category, index) => (
                                <option key={index} value={category === 'Category' ? '' : category}>
                                    {category}
                                </option>
                            ))}
                        </select>
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
                            <th>ACTION</th> {/* New header for actions */}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredItems.length > 0 ? (
                            filteredItems.map(item => (
                                <tr key={item.id}>
                                    <td>{item.itemCode}</td>
                                    <td>{item.name}</td>
                                    <td>{item.category}</td>
                                    <td>{item.type === 'preloved' ? 'Pre-loved' : 'Brand New'}</td>
                                    <td>${item.price.toFixed(2)}</td>
                                    <td>{item.owner}</td>
                                    <td>
                                        <button 
                                            onClick={() => handleDeleteItem(item.id, item.name)} 
                                            disabled={isDeleting}
                                            style={{
                                                backgroundColor: '#ff4d4f',
                                                color: 'white',
                                                border: 'none',
                                                padding: '5px 10px',
                                                borderRadius: '4px',
                                                cursor: isDeleting ? 'not-allowed' : 'pointer'
                                            }}
                                        >
                                            {isDeleting ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                                    No items found matching the selected filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}