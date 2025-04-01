import { useLoaderData } from "react-router-dom";
import { useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Paper,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Container
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import Header from './Header';
import Footer from './Footer';

function Orders() {
    const orders = useLoaderData();
    const [selectedOrder, setSelectedOrder] = useState(null);

    const openOrderDetails = (order) => {
        setSelectedOrder(order);
    };

    const closeOrderDetails = () => {
        setSelectedOrder(null);
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />

            <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
                <Typography variant="h1" gutterBottom>Your Orders</Typography>

                {orders.length === 0 ? (
                    <Paper elevation={0} sx={{ p: 3 }}>
                        <Typography variant="body1">You don't have any orders yet.</Typography>
                    </Paper>
                ) : (
                    <Grid container spacing={3}>
                        {orders.map(order => (
                            <Grid item xs={12} key={order.id}>
                                <Card
                                    onClick={() => openOrderDetails(order)}
                                    sx={{
                                        cursor: 'pointer',
                                        '&:hover': {
                                            borderLeft: '4px solid',
                                            borderLeftColor: 'secondary.main'
                                        }
                                    }}
                                >
                                    <CardContent>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={3}>
                                                <Typography variant="subtitle1" color="text.secondary">Order #</Typography>
                                                <Typography variant="body1">{order.orderNumber}</Typography>
                                            </Grid>
                                            <Grid item xs={12} md={3}>
                                                <Typography variant="subtitle1" color="text.secondary">Date</Typography>
                                                <Typography variant="body1">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} md={3}>
                                                <Typography variant="subtitle1" color="text.secondary">Total</Typography>
                                                <Typography variant="body1">₱{order.total.toFixed(2)}</Typography>
                                            </Grid>
                                            <Grid item xs={12} md={3}>
                                                <Typography variant="subtitle1" color="text.secondary">Status</Typography>
                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        color: order.status === 'Completed' ? 'success.main' :
                                                            order.status === 'Processing' ? 'warning.main' :
                                                                'text.primary'
                                                    }}
                                                >
                                                    {order.status
                                                        .replace(/_/g, ' ')
                                                        .split(' ')
                                                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                                        .join(' ')
                                                    }
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>

            <Dialog
                open={Boolean(selectedOrder)}
                onClose={closeOrderDetails}
                maxWidth="md"
                fullWidth
            >
                {selectedOrder && (
                    <>
                        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h2">Order Details (#{selectedOrder.orderNumber})</Typography>
                            <IconButton onClick={closeOrderDetails}>
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>

                        <DialogContent dividers>
                            <Grid container spacing={4}>
                                <Grid item xs={12} md={6}>
                                    <Paper elevation={0} sx={{ p: 3 }}>
                                        <Typography variant="h3" gutterBottom>Customer Information</Typography>
                                        <List dense>
                                            <ListItem disablePadding>
                                                <ListItemText
                                                    primary="Full Name"
                                                    secondary={selectedOrder.deliveryDetails.fullName}
                                                />
                                            </ListItem>
                                            <Divider component="li" />
                                            <ListItem disablePadding>
                                                <ListItemText
                                                    primary="Contact Number"
                                                    secondary={selectedOrder.deliveryDetails.contactNumber}
                                                />
                                            </ListItem>
                                            <Divider component="li" />
                                            <ListItem disablePadding>
                                                <ListItemText
                                                    primary="Street Address"
                                                    secondary={selectedOrder.deliveryDetails.street}
                                                />
                                            </ListItem>
                                            <Divider component="li" />
                                            <ListItem disablePadding>
                                                <ListItemText
                                                    primary="Town/City"
                                                    secondary={selectedOrder.deliveryDetails.city}
                                                />
                                            </ListItem>
                                        </List>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Paper elevation={0} sx={{ p: 3 }}>
                                        <Typography variant="h3" gutterBottom>Delivery Information</Typography>
                                        <List dense>
                                            <ListItem disablePadding>
                                                <ListItemText
                                                    primary="Mode of Delivery"
                                                    secondary={selectedOrder.deliveryDetails.mode}
                                                />
                                            </ListItem>
                                            <Divider component="li" />
                                            <ListItem disablePadding>
                                                <ListItemText
                                                    primary="Payment Method"
                                                    secondary={selectedOrder.paymentMethod}
                                                />
                                            </ListItem>
                                        </List>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12}>
                                    <Paper elevation={0} sx={{ p: 3 }}>
                                        <Typography variant="h3" gutterBottom>Order Items</Typography>
                                        <List>
                                            {selectedOrder.items.map((item, index) => (
                                                <ListItem key={index} disablePadding>
                                                    <ListItemText
                                                        primary={`${item.itemId.name || "Item"} - Quantity: ${item.quantity}`}
                                                        secondary={`Price: ₱${item.price.toFixed(2)}`}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>

                                        <Box sx={{ mt: 3, textAlign: 'right' }}>
                                            <Typography variant="body1" sx={{ mb: 1 }}>
                                                <strong>Subtotal:</strong> ${selectedOrder.subtotal.toFixed(2)}
                                            </Typography>
                                            <Typography variant="h6">
                                                <strong>Total:</strong> ${selectedOrder.total.toFixed(2)}
                                            </Typography>
                                        </Box>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </DialogContent>

                        <DialogActions>
                            <Button
                                onClick={closeOrderDetails}
                                color="primary"
                                variant="outlined"
                            >
                                Close
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>

            <Footer />
        </Box>
    );
}

export default Orders;

