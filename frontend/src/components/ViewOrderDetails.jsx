import { useLoaderData, Link, Form } from 'react-router-dom';
import {
    Box,
    Button,
    Card,
    Container,
    Chip,
    Divider,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableFooter,
    Typography,
    Avatar
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    CheckCircle as CheckCircleIcon,
    LocalShipping as LocalShippingIcon,
    NotificationsActive as NotificationsActiveIcon
} from '@mui/icons-material';

export default function ViewOrderDetails() {
    const order = useLoaderData();
    const user = JSON.parse(localStorage.getItem('user'));

    // Format date to be more readable
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h3" component="h1" fontWeight={600} mb={4}>
                Order Details
            </Typography>

            <Box mb={4}>
                <Button
                    component={Link}
                    to={`/${user.role}/orders`}
                    startIcon={<ArrowBackIcon />}
                    variant="outlined"
                >
                    Back to Orders
                </Button>
            </Box>

            <Card sx={{ mb: 4, p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
                    <Box>
                        <Typography variant="h4" component="h2" fontWeight={500}>
                            Order #{order.orderNumber}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" mt={1}>
                            <strong>Date:</strong> {formatDate(order.createdAt)}
                        </Typography>
                    </Box>

                    <Box textAlign="right">
                        <Chip
                            label={order.status.replace(/_/g, ' ').toUpperCase()}
                            color={
                                order.status === 'completed' ? 'success' : 
                                order.status === 'out_for_delivery' || order.status === 'ready_for_pickup' ? 'info' : 
                                'warning'
                            }
                            sx={{
                                fontWeight: 500,
                                fontSize: '0.875rem',
                                px: 2,
                                py: 0.5
                            }}
                        />

                        {order.status === 'pending' && user.role === 'admin' && (
                            <Box mt={2} sx={{ display: 'flex', gap: 2 }}>
                                {/* Out for Delivery button - only show for delivery mode */}
                                {order.deliveryDetails.mode === 'delivery' && (
                                    <Form method="post">
                                        <input type="hidden" name="action" value="markAsOutForDelivery" />
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            startIcon={<LocalShippingIcon />}
                                        >
                                            Mark as Out for Delivery
                                        </Button>
                                    </Form>
                                )}

                                {/* Ready for Pickup button - only show for pickup mode */}
                                {order.deliveryDetails.mode === 'pickup' && (
                                    <Form method="post">
                                        <input type="hidden" name="action" value="markAsReadyForPickup" />
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            startIcon={<NotificationsActiveIcon />}
                                        >
                                            Mark as Ready for Pickup
                                        </Button>
                                    </Form>
                                )}

                                {/* Mark as Completed button - show for all orders */}
                                <Form method="post">
                                    <input type="hidden" name="action" value="markAsCompleted" />
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="success"
                                        startIcon={<CheckCircleIcon />}
                                    >
                                        Mark as Completed
                                    </Button>
                                </Form>
                            </Box>
                        )}

                        {/* For out_for_delivery and ready_for_pickup orders */}
                        {(order.status === 'out_for_delivery' || order.status === 'ready_for_pickup') && user.role === 'admin' && (
                            <Box mt={2}>
                                <Form method="post">
                                    <input type="hidden" name="action" value="markAsCompleted" />
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="success"
                                        startIcon={<CheckCircleIcon />}
                                    >
                                        Mark as Completed
                                    </Button>
                                </Form>
                            </Box>
                        )}
                    </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5" component="h3" fontWeight={500} mb={2}>
                            Customer Information
                        </Typography>
                        <Box sx={{ '& > p': { mb: 1 } }}>
                            <Typography variant="body1">
                                <strong>Name:</strong> {order.deliveryDetails.fullName}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Contact:</strong> {order.deliveryDetails.contactNumber}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Address:</strong> {order.deliveryDetails.street}, {order.deliveryDetails.city}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography variant="h5" component="h3" fontWeight={500} mb={2}>
                            Order Information
                        </Typography>
                        <Box sx={{ '& > p': { mb: 1 } }}>
                            <Typography variant="body1">
                                <strong>Delivery Method:</strong> {order.deliveryDetails.mode}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Payment Method:</strong> {order.paymentMethod}
                            </Typography>
                            {order.outForDeliveryAt && (
                                <Typography variant="body1">
                                    <strong>Out for Delivery Date:</strong> {formatDate(order.outForDeliveryAt)}
                                </Typography>
                            )}
                            {order.readyForPickupAt && (
                                <Typography variant="body1">
                                    <strong>Ready for Pickup Date:</strong> {formatDate(order.readyForPickupAt)}
                                </Typography>
                            )}
                            {order.completedAt && (
                                <Typography variant="body1">
                                    <strong>Completed Date:</strong> {formatDate(order.completedAt)}
                                </Typography>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </Card>

            <Card sx={{ p: 3 }}>
                <Typography variant="h5" component="h3" fontWeight={500} mb={3}>
                    Order Items
                </Typography>

                <TableContainer component={Paper} elevation={0}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'background.paper' }}>
                                <TableCell>Image</TableCell>
                                <TableCell>Item</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell align="right">Total</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {order.items.map((item, index) => (
                                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell>
                                        <Avatar
                                            src={item.itemDetails.images && item.itemDetails.images.length > 0 
                                                ? item.itemDetails.images[0] 
                                                : ''}
                                            alt={item.itemDetails.name}
                                            variant="rounded"
                                            sx={{ width: 60, height: 60, objectFit: 'cover' }}
                                        />
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <Box>
                                            <Typography variant="body1" fontWeight={500}>
                                                {item.itemDetails.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {item.itemDetails.itemCode}
                                            </Typography>
                                            <Box sx={{ display: 'flex', mt: 1 }}>
                                                <Chip 
                                                    label={item.itemDetails.type === 'preloved' ? 'Pre-loved' : 'Brand New'} 
                                                    size="small"
                                                    color={item.itemDetails.type === 'preloved' ? 'secondary' : 'primary'}
                                                    sx={{ fontSize: '0.75rem' }}
                                                />
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>₱{item.price.toFixed(2)}</TableCell>
                                    <TableCell align="right">₱{(item.price).toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={3} align="right" sx={{ fontWeight: 500 }}>Subtotal:</TableCell>
                                <TableCell align="right">₱{order.subtotal.toFixed(2)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={3} align="right" sx={{ fontWeight: 600 }}>Total:</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                                    ₱{order.total.toFixed(2)}
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Card>
        </Container>
    );
}
