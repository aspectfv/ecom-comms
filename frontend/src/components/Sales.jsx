import { useState, useEffect } from 'react';
import { useLoaderData, useSearchParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  Box, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Button, 
  Card, 
  CardContent, 
  Grid, 
  Divider, 
  Menu
} from '@mui/material';
import { 
  FileDownload as FileDownloadIcon, 
  PictureAsPdf as PdfIcon 
} from '@mui/icons-material';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

export default function Sales() {
    const completedOrders = useLoaderData();
    
    // Use search params for state persistence in URL
    const [searchParams, setSearchParams] = useSearchParams();

    // Initialize states from URL params
    const [selectedOwner, setSelectedOwner] = useState(searchParams.get('owner') || '');
    const [selectedPeriod, setSelectedPeriod] = useState(searchParams.get('period') || '');
    
    // Export menu state
    const [exportMenuAnchorEl, setExportMenuAnchorEl] = useState(null);
    const isExportMenuOpen = Boolean(exportMenuAnchorEl);

    // Process sales data from completed orders
    const salesData = [];
    completedOrders.forEach(order => {
        if (order.status === 'completed' && order.completedAt) {
            order.items.forEach(item => {
                if (item.itemDetails) {
                    salesData.push({
                        id: `${order.id}-${item.itemDetails.originalItemId}`,
                        orderId: order.id,
                        orderNumber: order.orderNumber,
                        itemId: item.itemDetails.originalItemId,
                        itemCode: item.itemDetails.itemCode,
                        itemName: item.itemDetails.name,
                        itemPrice: item.price,
                        owner: item.itemDetails.owner,
                        date: new Date(order.completedAt)
                    });
                }
            });
        }
    });

    // Extract unique owners from sales data
    const owners = ['All Owners', ...new Set(salesData.map(sale => sale.owner))].filter(Boolean);

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
        } else if (periodParam === 'Last 7 Days') {
            const lastWeek = new Date(now.setDate(now.getDate() - 7));
            matchesPeriod = completedDate >= lastWeek;
        } else if (periodParam === 'This Month') {
            const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            matchesPeriod = completedDate >= firstDayOfMonth;
        } else if (periodParam === 'This Year') {
            const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
            matchesPeriod = completedDate >= firstDayOfYear;
        }

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
        const value = e.target.value === 'All Owners' ? '' : e.target.value;
        setSelectedOwner(value);
        updateSearchParams('owner', value);
    };

    // Handle period selection change
    const handlePeriodChange = (e) => {
        setSelectedPeriod(e.target.value);
        updateSearchParams('period', e.target.value);
    };

    // Clear all filters
    const handleClearFilters = () => {
        setSelectedOwner('');
        setSelectedPeriod('');
        setSearchParams({});
    };
    
    // Export menu handlers
    const handleExportMenuOpen = (event) => {
        setExportMenuAnchorEl(event.currentTarget);
    };
    
    const handleExportMenuClose = () => {
        setExportMenuAnchorEl(null);
    };

    // Export sales data as CSV
    const handleExportCSV = () => {
        handleExportMenuClose();
        
        if (!filteredSales || filteredSales.length === 0) {
            alert('No sales data to export.');
            return;
        }

        // Generate CSV content with summary data
        const headers = ['OWNER', 'TOTAL SALES'];
        const summaryData = Object.entries(salesByOwner).map(([owner, total]) => [
            owner, `₱${total.toFixed(2)}`
        ]);
        
        const csvContent = [
            headers.join(','),
            ...summaryData.map(row => row.join(','))
        ].join('\n');

        // Create a Blob and download the file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'sales_summary.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    // Export sales data as PDF
    const handleExportPDF = () => {
        handleExportMenuClose();
        
        if (!filteredSales || filteredSales.length === 0) {
            alert('No sales data to export.');
            return;
        }
        
        // Initialize PDF document
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(18);
        doc.text('Sales Summary Report', 14, 20);
        
        // Add filters information
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
        doc.text(`Filters: ${selectedOwner || 'All Owners'} | ${selectedPeriod || 'All Time'}`, 14, 35);
        
        // Add total sales
        doc.setFontSize(14);
        doc.text(`Total Sales: ₱${totalSales.toFixed(2)}`, 14, 45);
        
        // Create summary table
        const summaryRows = Object.entries(salesByOwner).map(([owner, total]) => [
            owner, `₱${total.toFixed(2)}`
        ]);
        
        autoTable(doc, {
            head: [['Owner', 'Total Sales']],
            body: summaryRows,
            startY: 55,
            styles: { fontSize: 10, cellPadding: 5 },
            headStyles: { fillColor: [66, 66, 66] },
            alternateRowStyles: { fillColor: [245, 245, 245] }
        });
        
        // Save the PDF
        doc.save('sales_summary.pdf');
    };

    // Calculate total sales
    const totalSales = filteredSales.reduce((sum, sale) => sum + sale.itemPrice, 0);
    
    // Group sales by owner for summary
    const salesByOwner = {};
    filteredSales.forEach(sale => {
        if (!salesByOwner[sale.owner]) {
            salesByOwner[sale.owner] = 0;
        }
        salesByOwner[sale.owner] += sale.itemPrice;  // Instead of sale.total
    });
    
    // Group sales by month for trend analysis
    const salesByMonth = {};
    filteredSales.forEach(sale => {
        const date = new Date(sale.completedAt);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
        
        if (!salesByMonth[monthYear]) {
            salesByMonth[monthYear] = 0;
        }
        salesByMonth[monthYear] += sale.itemPrice;   // Instead of sale.total
    });
    
    // Prepare chart data
    const ownerChartData = {
        labels: Object.keys(salesByOwner),
        datasets: [
            {
                label: 'Sales by Owner',
                data: Object.values(salesByOwner),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                ],
                borderWidth: 1
            }
        ]
    };
    
    // Sort months chronologically
    const sortedMonths = Object.keys(salesByMonth).sort((a, b) => {
        const [monthA, yearA] = a.split('/').map(Number);
        const [monthB, yearB] = b.split('/').map(Number);
        
        if (yearA !== yearB) return yearA - yearB;
        return monthA - monthB;
    });
    
    const trendChartData = {
        labels: sortedMonths,
        datasets: [
            {
                label: 'Sales Trend',
                data: sortedMonths.map(month => salesByMonth[month]),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4
            }
        ]
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1" fontWeight={600}>
                    Sales Report
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        onClick={handleExportMenuOpen}
                        startIcon={<FileDownloadIcon />}
                        variant="outlined"
                    >
                        Export
                    </Button>
                    <Menu
                        anchorEl={exportMenuAnchorEl}
                        open={isExportMenuOpen}
                        onClose={handleExportMenuClose}
                    >
                        <MenuItem onClick={handleExportCSV}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <FileDownloadIcon fontSize="small" />
                                <Typography>Export as CSV</Typography>
                            </Box>
                        </MenuItem>
                        <MenuItem onClick={handleExportPDF}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PdfIcon fontSize="small" />
                                <Typography>Export as PDF</Typography>
                            </Box>
                        </MenuItem>
                    </Menu>
                </Box>
            </Box>
            
            <Card sx={{ mb: 3, p: 2 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel>Owner</InputLabel>
                        <Select
                            value={selectedOwner || ''}
                            onChange={handleOwnerChange}
                            label="Owner"
                        >
                            {owners.map((owner, index) => (
                                <MenuItem key={index} value={owner === 'All Owners' ? '' : owner}>
                                    {owner}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel>Period</InputLabel>
                        <Select
                            value={selectedPeriod || ''}
                            onChange={handlePeriodChange}
                            label="Period"
                        >
                            <MenuItem value="">All Time</MenuItem>
                            <MenuItem value="Last 24 Hours">Last 24 Hours</MenuItem>
                            <MenuItem value="Last 7 Days">Last 7 Days</MenuItem>
                            <MenuItem value="This Month">This Month</MenuItem>
                            <MenuItem value="This Year">This Year</MenuItem>
                        </Select>
                    </FormControl>
                    
                    {(searchParams.size > 0) && (
                        <Button 
                            onClick={handleClearFilters}
                            size="small"
                            variant="outlined"
                        >
                            Clear Filters
                        </Button>
                    )}
                </Box>
            </Card>
            
            {/* Summary Cards */}
            <Typography variant="h5" sx={{ mb: 2 }}>Summary</Typography>
            
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                Total Sales
                            </Typography>
                            <Typography variant="h3" component="div" color="primary">
                                ₱{totalSales.toFixed(2)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                {selectedPeriod || 'All time'} • {selectedOwner || 'All owners'}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                Number of Orders
                            </Typography>
                            <Typography variant="h3" component="div" color="primary">
                                {new Set(filteredSales.map(sale => sale.orderId)).size}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Unique completed orders
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                Average Order Value
                            </Typography>
                            <Typography variant="h3" component="div" color="primary">
                                ₱{(totalSales / (new Set(filteredSales.map(sale => sale.orderId)).size || 1)).toFixed(2)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Per completed order
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            
            {/* Charts */}
            <Typography variant="h5" sx={{ mb: 2 }}>Sales Analysis</Typography>
            
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card sx={{ p: 2, height: '100%' }}>
                        <Typography variant="h6" align="center" gutterBottom>
                            Sales by Owner
                        </Typography>
                        <Box sx={{ height: 300 }}>
                            {Object.keys(salesByOwner).length > 0 ? (
                                <Pie 
                                    data={ownerChartData} 
                                    options={{ 
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                position: 'bottom'
                                            }
                                        }
                                    }} 
                                />
                            ) : (
                                <Box sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    alignItems: 'center',
                                    height: '100%'
                                }}>
                                    <Typography variant="body1" color="text.secondary">
                                        No data available
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                    <Card sx={{ p: 2, height: '100%' }}>
                        <Typography variant="h6" align="center" gutterBottom>
                            Sales by Owner
                        </Typography>
                        <Box sx={{ height: 300 }}>
                            {Object.keys(salesByOwner).length > 0 ? (
                                <Bar 
                                    data={ownerChartData} 
                                    options={{ 
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                display: false
                                            }
                                        }
                                    }} 
                                />
                            ) : (
                                <Box sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    alignItems: 'center',
                                    height: '100%'
                                }}>
                                    <Typography variant="body1" color="text.secondary">
                                        No data available
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Card>
                </Grid>
                
                <Grid item xs={12}>
                    <Card sx={{ p: 2 }}>
                        <Typography variant="h6" align="center" gutterBottom>
                            Sales Trend
                        </Typography>
                        <Box sx={{ height: 300 }}>
                            {sortedMonths.length > 0 ? (
                                <Line 
                                    data={trendChartData} 
                                    options={{ 
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                display: false
                                            }
                                        }
                                    }} 
                                />
                            ) : (
                                <Box sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    alignItems: 'center',
                                    height: '100%'
                                }}>
                                    <Typography variant="body1" color="text.secondary">
                                        No data available
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Card>
                </Grid>
            </Grid>
            
            {/* Sales by Owner Table */}
            <Typography variant="h5" sx={{ my: 2 }}>Sales by Owner</Typography>
            <Card>
                <Box component="table" sx={{ 
                    width: '100%', 
                    borderCollapse: 'collapse',
                    '& th, & td': {
                        border: '1px solid #ddd',
                        padding: '12px 16px',
                        textAlign: 'left'
                    },
                    '& th': {
                        backgroundColor: '#f5f5f5',
                        fontWeight: 600
                    }
                }}>
                    <Box component="thead">
                        <Box component="tr">
                            <Box component="th">Owner</Box>
                            <Box component="th">Total Sales</Box>
                            <Box component="th">Share (%)</Box>
                        </Box>
                    </Box>
                    <Box component="tbody">
                        {Object.entries(salesByOwner).length > 0 ? (
                            Object.entries(salesByOwner).map(([owner, total], index) => (
                                <Box component="tr" key={index}>
                                    <Box component="td">{owner}</Box>
                                    <Box component="td">₱{total.toFixed(2)}</Box>
                                    <Box component="td">
                                        {((total / totalSales) * 100).toFixed(1)}%
                                    </Box>
                                </Box>
                            ))
                        ) : (
                            <Box component="tr">
                                <Box component="td" colSpan={3} sx={{ textAlign: 'center', py: 3 }}>
                                    No sales data available
                                </Box>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Card>
        </Box>
    );
}
