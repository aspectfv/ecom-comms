import { useLoaderData } from "react-router-dom";
import { useState, Fragment } from "react";
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
    Container,
    Avatar,
    ListItemAvatar
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

    // Removed the useEffect hook

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
                                {/* Customer Information */}
                                <Grid item xs={12} md={6}>
                                    <Paper elevation={0} sx={{ p: 3, height: '100%' }}>
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

                                {/* Delivery Information */}
                                <Grid item xs={12} md={6}>
                                    <Paper elevation={0} sx={{ p: 3, height: '100%' }}>
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

                                {/* Order Items */}
                                <Grid item xs={12}>
                                    <Paper elevation={0} sx={{ p: 3 }}>
                                        <Typography variant="h3" gutterBottom>Order Items</Typography>
                                        <List>
                                            {selectedOrder.items.map((item, index) => (
                                                <Fragment key={`${item.itemId?._id || index}-${index}`}>
                                                    <ListItem disablePadding sx={{ py: 1.5 }}>
                                                        {/* Conditionally render Avatar if image exists */}
                                                        {item.itemId?.images?.[0] && (
                                                            <ListItemAvatar>
                                                                <Avatar
                                                                    variant="square" // Often better for product images
                                                                    src={item.itemId.images[0]}
                                                                    alt={item.itemId.name || 'Item image'}
                                                                    sx={{ width: 56, height: 56, mr: 2, borderRadius: 1 }} // Adjust size and margin
                                                                />
                                                            </ListItemAvatar>
                                                        )}
                                                        <ListItemText
                                                            primary={`${item.itemId?.name || "Item Name Unavailable"} - Quantity: ${item.quantity}`} // Safer access to name
                                                            secondary={`Price: ₱${item.price.toFixed(2)}`}
                                                            primaryTypographyProps={{ fontWeight: 'medium' }}
                                                        />
                                                    </ListItem>
                                                    {index < selectedOrder.items.length - 1 && (
                                                        <Divider component="li" variant="inset" />
                                                    )}
                                                </Fragment>
                                            ))}
                                        </List>

                                        <Box sx={{ mt: 3, textAlign: 'right' }}>
                                            <Typography variant="body1" sx={{ mb: 1 }}>
                                                <strong>Subtotal:</strong> ₱{selectedOrder.subtotal.toFixed(2)} {/* Corrected currency */}
                                            </Typography>
                                            <Typography variant="h6">
                                                <strong>Total:</strong> ₱{selectedOrder.total.toFixed(2)} {/* Corrected currency */}
                                            </Typography>
                                        </Box>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </DialogContent>

                        <DialogActions sx={{ p: 2 }}>
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
