import { useLoaderData } from 'react-router-dom';

export default function Sales() {
    const salesData = useLoaderData(); // Load sales data from the loader

    // Export sales data as CSV
    const handleExportList = () => {
        if (!salesData || salesData.length === 0) {
            alert('No sales data to export.');
            return;
        }

        // Generate CSV content
        const headers = ['ITEM CODE', 'ITEM NAME', 'OWNER', 'DATE COMPLETED', 'TOTAL'];
        const rows = salesData.map(sale => [
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
                    <select>
                        <option>Owner</option>
                        <option>Partner A</option>
                        <option>Partner B</option>
                    </select>

                    <select>
                        <option>Period</option>
                        <option>Last 24 Hours</option>
                        <option>Last 1 Week</option>
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
                        <th>ITEM CODE</th>
                        <th>ITEM NAME</th>
                        <th>OWNER</th>
                        <th>DATE COMPLETED</th>
                        <th>TOTAL</th>
                    </tr>
                </thead>
                <tbody>
                    {salesData.map((sale) => (
                        <tr key={sale.id}>
                            <td>{sale.itemCode}</td>
                            <td>{sale.itemName}</td>
                            <td>{sale.owner}</td>
                            <td>{new Date(sale.completedAt).toLocaleDateString()}</td>
                            <td>${sale.total.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}