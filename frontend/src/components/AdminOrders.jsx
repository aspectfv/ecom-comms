import { useState } from 'react';
import { useLoaderData, Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Card,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    FormControl,
    InputAdornment,
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
    TextField,
    Typography
} from '@mui/material';
import {
    Search as SearchIcon,
    Clear as ClearIcon,
    Visibility,
    FileDownload as FileDownloadIcon
} from '@mui/icons-material';

export default function AdminOrders() {
    const orders = useLoaderData();
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');
    const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || '');
    const [selectedPeriod, setSelectedPeriod] = useState(searchParams.get('period') || '');

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

    const handleSearch = (e) => {
        e.preventDefault();
        updateSearchParams('q', searchInput);
    };

    const updateSearchParams = (key, value) => {
        const newParams = new URLSearchParams(searchParams);

        if (value && value !== '') {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }

        setSearchParams(newParams);
    };

    const handleSearchInputChange = (e) => {
        setSearchInput(e.target.value);
    };

    const handleStatusChange = (e) => {
        const value = e.target.value === 'All Statuses' ? '' : e.target.value;
        setSelectedStatus(value);
        updateSearchParams('status', value.toLowerCase());
    };

    const handlePeriodChange = (e) => {
        const value = e.target.value === 'All Time' ? '' : e.target.value;
        setSelectedPeriod(value);
        updateSearchParams('period', value);
    };

    const handleClearFilters = () => {
        setSearchInput('');
        setSelectedStatus('');
        setSelectedPeriod('');
        setSearchParams({});
    };

    const handleExportList = () => {
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
            order.status.toUpperCase()
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

    return (
        <Container maxWidth={false} sx={{ p: 3 }}>
            {/* Header with search and user info */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 4
                }}
            >
                <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        variant="outlined"
                        size="small"
                        placeholder="Search orders..."
                        value={searchInput}
                        onChange={handleSearchInputChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ minWidth: 300 }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                    >
                        Search
                    </Button>
                    {searchParams.size > 0 && (
                        <Button
                            onClick={handleClearFilters}
                            startIcon={<ClearIcon />}
                            color="secondary"
                        >
                            Clear Filters
                        </Button>
                    )}
                </Box>

                <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="subtitle1" fontWeight={500}>
                        {user?.fullName || user?.username || 'Admin'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {user?.role || 'Admin'}
                    </Typography>
                </Box>
            </Box>

            {/* Orders content */}
            <Card sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" component="h1" fontWeight={600}>
                        Orders
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            onClick={handleExportList}
                            startIcon={<FileDownloadIcon />}
                            variant="outlined"
                        >
                            Export List
                        </Button>
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
                                                color={order.status === 'completed' ? 'success.main' : 'warning.main'}
                                                sx={{
                                                    padding: '4px 8px',
                                                    display: 'inline-block'
                                                }}
                                            >
                                                {order.status.toUpperCase()}
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
