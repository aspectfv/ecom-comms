import { useState, useContext } from 'react';
import { useLoaderData, Link, useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Card,
    Container,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Menu
} from '@mui/material';
import {
    Visibility,
    FileDownload as FileDownloadIcon,
    PictureAsPdf as PdfIcon
} from '@mui/icons-material';
import { SearchContext } from './Management';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function AdminOrders() {
    const orders = useLoaderData();
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    const { searchParams, updateSearchParams } = useContext(SearchContext);
    const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || '');
    const [selectedPeriod, setSelectedPeriod] = useState(searchParams.get('period') || '');
    
    // Export menu state
    const [exportMenuAnchorEl, setExportMenuAnchorEl] = useState(null);
    const isExportMenuOpen = Boolean(exportMenuAnchorEl);

    const filteredOrders = orders.filter(order => {
        const searchQuery = searchParams.get('q') || '';
        const matchesSearch = !searchQuery ||
            order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.deliveryDetails.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (order.paymentMethod && order.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase()));

        const statusParam = searchParams.get('status') || '';
        const matchesStatus = !statusParam || order.status === statusParam.toLowerCase();

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

        return matchesSearch && matchesStatus && matchesPeriod;
    });

    // Handle export menu
    const handleExportMenuOpen = (event) => {
        setExportMenuAnchorEl(event.currentTarget);
    };
    
    const handleExportMenuClose = () => {
        setExportMenuAnchorEl(null);
    };

    const handleExportCSV = () => {
        handleExportMenuClose();
        
        if (!filteredOrders || filteredOrders.length === 0) {
            alert('No orders data to export.');
            return;
        }

        const headers = ['ORDER NUMBER', 'CUSTOMER', 'DATE', 'TOTAL', 'STATUS'];
        const rows = filteredOrders.map(order => [
            order.orderNumber,
            order.deliveryDetails.fullName,
            new Date(order.createdAt).toLocaleDateString(),
            `₱${order.total.toFixed(2)}`,
            order.status.replace(/_/g, ' ').toUpperCase()
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'orders_data.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const handleExportPDF = () => {
        handleExportMenuClose();
        
        if (!filteredOrders || filteredOrders.length === 0) {
            alert('No orders data to export.');
            return;
        }
        
        // Initialize PDF document
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(18);
        doc.text('Orders List', 14, 20);
        
        // Add date
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 26);
        
        // Define table columns and rows
        const tableColumn = ['Order Number', 'Customer', 'Date', 'Total', 'Status'];
        const tableRows = filteredOrders.map(order => [
            order.orderNumber,
            order.deliveryDetails.fullName,
            new Date(order.createdAt).toLocaleDateString(),
            `₱${order.total.toFixed(2)}`,
            order.status
        ]);
        
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 30,
            styles: { fontSize: 8, cellPadding: 3 },
            headStyles: { fillColor: [66, 66, 66] },
            alternateRowStyles: { fillColor: [245, 245, 245] }
        });
        
        // Add total count
        const finalY = (doc.lastAutoTable && doc.lastAutoTable.finalY) || 30;
        doc.text(`Total Orders: ${filteredOrders.length}`, 14, finalY + 10);
        
        // Save the PDF
        doc.save('orders_list.pdf');
    };

    const handleStatusChange = (e) => {
        const value = e.target.value === 'All Statuses' ? '' : e.target.value;
        setSelectedStatus(value);
        
        // Convert UI status to database format (replace spaces with underscores)
        let statusValue = '';
        if (value) {
            statusValue = value.toLowerCase().replace(/ /g, '_');
        }
        
        updateSearchParams('status', statusValue);
    };

    const handlePeriodChange = (e) => {
        const value = e.target.value === 'All Time' ? '' : e.target.value;
        setSelectedPeriod(value);
        updateSearchParams('period', value);
    };

    const handleClearFilters = () => {
        setSelectedStatus('');
        setSelectedPeriod('');
        setSearchParams({});
    };

    return (
        <Container maxWidth={false} sx={{ p: 3 }}>
            {/* Orders content */}
            <Card sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" component="h1" fontWeight={600}>
                        Orders
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

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <FormControl size="small" sx={{ minWidth: 180 }}>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={selectedStatus || ''}
                                onChange={handleStatusChange}
                                label="Status"
                            >
                                <MenuItem value="All Statuses">All Statuses</MenuItem>
                                <MenuItem value="Pending">Pending</MenuItem>
                                <MenuItem value="Out for Delivery">Out for Delivery</MenuItem>
                                <MenuItem value="Ready for Pickup">Ready for Pickup</MenuItem>
                                <MenuItem value="Completed">Completed</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl size="small" sx={{ minWidth: 180 }}>
                            <InputLabel>Period</InputLabel>
                            <Select
                                value={selectedPeriod || 'All Time'}
                                onChange={handlePeriodChange}
                                label="Period"
                            >
                                <MenuItem value="All Time">All Time</MenuItem>
                                <MenuItem value="Last 24 Hours">Last 24 Hours</MenuItem>
                                <MenuItem value="Last 7 Days">Last 7 Days</MenuItem>
                                <MenuItem value="This Month">This Month</MenuItem>
                                <MenuItem value="This Year">This Year</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Orders Table */}
                <TableContainer component={Paper} elevation={0}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ORDER NUMBER</TableCell>
                                <TableCell>CUSTOMER</TableCell>
                                <TableCell>DATE</TableCell>
                                <TableCell>TOTAL</TableCell>
                                <TableCell>STATUS</TableCell>
                                <TableCell>ACTION</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map(order => (
                                    <TableRow key={order.id} hover>
                                        <TableCell>{order.orderNumber}</TableCell>
                                        <TableCell>{order.deliveryDetails.fullName}</TableCell>
                                        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell>₱{order.total.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                fontWeight={500}
                                                color={
                                                    order.status === 'completed' ? 'success.main' : 
                                                    order.status === 'out_for_delivery' || order.status === 'ready_for_pickup' ? 'info.main' : 
                                                    'warning.main'
                                                }
                                                sx={{
                                                    padding: '4px 8px',
                                                    display: 'inline-block'
                                                }}
                                            >
                                                {order.status.replace(/_/g, ' ').toUpperCase()}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                component={Link}
                                                to={`/${user.role}/order/${order.id}`}
                                                startIcon={<Visibility />}
                                                variant="outlined"
                                                color="primary"
                                                size="small"
                                            >
                                                View
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                                        <Typography variant="body1" color="text.secondary">
                                            No orders found matching the selected filters.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </Container>
    );
}
