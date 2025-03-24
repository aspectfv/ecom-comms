import { useLoaderData, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Sales() {
    const salesData = useLoaderData(); // Load sales data from the loader
    
    // Use search params for state persistence in URL
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Initialize states from URL params
    const [selectedOwner, setSelectedOwner] = useState(searchParams.get('owner') || '');
    const [selectedPeriod, setSelectedPeriod] = useState(searchParams.get('period') || '');

    // Extract unique owners from sales data
    const owners = ['Owner', ...new Set(salesData.map(sale => sale.owner))].filter(Boolean);

    // Apply filters based on URL search params
    const filteredSales = salesData.filter(sale => {
        // Owner filter
        const ownerParam = searchParams.get('owner') || '';
        const matchesOwner = !ownerParam || sale.owner === ownerParam;
        
        // Period filter
        const periodParam = searchParams.get('period') || '';
        const completedDate = new Date(sale.completedAt);
        const now = new Date();
        let matchesPeriod = true;
        
        if (periodParam === 'Last 24 Hours') {
            const yesterday = new Date(now.setHours(now.getHours() - 24));
            matchesPeriod = completedDate >= yesterday;
        } else if (periodParam === 'Last 1 Week') {
            const lastWeek = new Date(now.setDate(now.getDate() - 7));
            matchesPeriod = completedDate >= lastWeek;
        } else if (periodParam === 'This Month') {
            const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            matchesPeriod = completedDate >= firstDayOfMonth;
        } else if (periodParam === 'This Year') {
            const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
            matchesPeriod = completedDate >= firstDayOfYear;
        }
        // All-Time doesn't need filtering
        
        return matchesOwner && matchesPeriod;
    });

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

    // Handle owner selection change
    const handleOwnerChange = (e) => {
        const value = e.target.value === 'Owner' ? '' : e.target.value;
        setSelectedOwner(value);
        updateSearchParams('owner', value);
    };
    
    // Handle period selection change
    const handlePeriodChange = (e) => {
        const value = e.target.value === 'Period' ? '' : e.target.value;
        setSelectedPeriod(value);
        updateSearchParams('period', value);
    };
    
    // Clear all filters
    const handleClearFilters = () => {
        setSelectedOwner('');
        setSelectedPeriod('');
        setSearchParams({});
    };

    // Export sales data as CSV
    const handleExportList = () => {
        if (!filteredSales || filteredSales.length === 0) {
            alert('No sales data to export.');
            return;
        }

        // Generate CSV content
        const headers = ['ITEM CODE', 'ITEM NAME', 'OWNER', 'DATE COMPLETED', 'TOTAL'];
        const rows = filteredSales.map(sale => [
            sale.itemCode,
            sale.itemName,
            sale.owner,
            new Date(sale.completedAt).toLocaleDateString(),
            `$${sale.total.toFixed(2)}`
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
        link.setAttribute('download', 'sales_data.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <h1>Sales</h1> 

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                    {/* Dynamic owner dropdown */}
                    <select 
                        value={selectedOwner || 'Owner'} 
                        onChange={handleOwnerChange}
                    >
                        {owners.map((owner, index) => (
                            <option key={index} value={owner === 'Owner' ? '' : owner}>
                                {owner}
                            </option>
                        ))}
                    </select>

                    {/* Period dropdown */}
                    <select 
                        value={selectedPeriod || 'Period'} 
                        onChange={handlePeriodChange}
                    >
                        <option>Period</option>
                        <option>Last 24 Hours</option>
                        <option>Last 1 Week</option>
                        <option>This Month</option>
                        <option>This Year</option>
                        <option>All-Time</option>
                    </select>

                    {(searchParams.size > 0) && (
                        <button onClick={handleClearFilters} style={{ marginLeft: '10px' }}>
                            Clear Filters
                        </button>
                    )}
                </div>

                <div>
                    <button onClick={handleExportList}>Export List</button>
                </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>ITEM CODE</th>
                        <th>ITEM NAME</th>
                        <th>OWNER</th>
                        <th>DATE COMPLETED</th>
                        <th>TOTAL</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredSales.length > 0 ? (
                        filteredSales.map((sale) => (
                            <tr key={sale.id}>
                                <td>{sale.itemCode}</td>
                                <td>{sale.itemName}</td>
                                <td>{sale.owner}</td>
                                <td>{new Date(sale.completedAt).toLocaleDateString()}</td>
                                <td>${sale.total.toFixed(2)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                                No sales found matching the selected filters.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}