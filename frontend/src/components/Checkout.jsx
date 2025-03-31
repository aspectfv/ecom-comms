import { useLoaderData, Form, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Radio,
    RadioGroup,
    FormControlLabel,
    Button,
    Divider,
    Grid,
    Avatar,
    Paper,
    Stack,
    Chip,
    Dialog, // Import Dialog
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import { LocalShipping, Payment, ShoppingCart, Help, Email, Phone, Home } from '@mui/icons-material';
import Header from './Header';
import Footer from './Footer';
import { useState } from 'react'; // Import useState

function Checkout() {
    const { items = [] } = useLoaderData();
    const subtotal = items.reduce((total, item) => total + (item.itemId.price * item.quantity), 0);
    const shippingFee = 5.99;
    const total = subtotal + shippingFee;

    const navigate = useNavigate(); // Hook for navigation
    const [open, setOpen] = useState(false); // State for dialog visibility

    const handleClose = () => {
        setOpen(false);
        navigate('/home'); // Redirect to /home
    };

    const handleSubmit = (event) => {
        //event.preventDefault(); //Removed prevent default
        setOpen(true);
    };

    return (
        <>
            <Header />
            <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
                    Checkout
                </Typography>

                <Grid container spacing={4}>
                    {/* Left Column - Order Summary and Delivery */}
                    <Grid item xs={12} md={7}>
                        <Card sx={{ mb: 4, boxShadow: 3 }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <ShoppingCart sx={{ mr: 2, color: 'secondary.main', fontSize: 30 }} />
                                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Your Order</Typography>
                                </Box>

                                <List>
                                    {items.map((item) => (
                                        <ListItem key={item.itemId.id} sx={{ px: 0, py: 2 }}>
                                            <Avatar
                                                src={item.itemId.images[0]}
                                                alt={item.itemId.name}
                                                variant="rounded"
                                                sx={{ width: 80, height: 80, mr: 2 }}
                                            />
                                            <ListItemText
                                                primary={
                                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                        {item.itemId.name}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <>
                                                        <Typography variant="body2" color="text.secondary">
                                                            ₱{item.itemId.price.toFixed(2)} × {item.quantity}
                                                        </Typography>
                                                        {item.itemId.inStock && (
                                                            <Chip
                                                                label="In Stock"
                                                                size="small"
                                                                color="success"
                                                                sx={{ mt: 0.5 }}
                                                            />
                                                        )}
                                                    </>
                                                }
                                            />
                                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                ₱{(item.itemId.price * item.quantity).toFixed(2)}
                                            </Typography>
                                        </ListItem>
                                    ))}
                                </List>

                                <Divider sx={{ my: 2 }} />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body1">Subtotal:</Typography>
                                    <Typography variant="body1">₱{subtotal.toFixed(2)}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body1">Shipping:</Typography>
                                    <Typography variant="body1">₱{shippingFee.toFixed(2)}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: '1px dashed #ddd' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total:</Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>₱{total.toFixed(2)}</Typography>
                                </Box>
                            </CardContent>
                        </Card>

                        <Form method="post" onSubmit={handleSubmit}>
                            <Card sx={{ mb: 4, boxShadow: 3 }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                        <LocalShipping sx={{ mr: 2, color: 'secondary.main', fontSize: 30 }} />
                                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Delivery Information</Typography>
                                    </Box>

                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                required
                                                id="fullName"
                                                name="fullName"
                                                label="Full Name"
                                                variant="outlined"
                                                sx={{ mb: 2 }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                required
                                                id="contactNumber"
                                                name="contactNumber"
                                                label="Contact Number"
                                                type="tel"
                                                variant="outlined"
                                                sx={{ mb: 2 }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                required
                                                id="street"
                                                name="street"
                                                label="Street Address"
                                                variant="outlined"
                                                sx={{ mb: 2 }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                id="apartment"
                                                name="apartment"
                                                label="Apartment, Floor, etc. (optional)"
                                                variant="outlined"
                                                sx={{ mb: 2 }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                required
                                                id="city"
                                                name="city"
                                                label="Town/City"
                                                variant="outlined"
                                                sx={{ mb: 2 }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth required sx={{ mb: 2 }}>
                                                <InputLabel id="deliveryMode-label">Mode of Delivery</InputLabel>
                                                <Select
                                                    labelId="deliveryMode-label"
                                                    id="deliveryMode"
                                                    name="deliveryMode"
                                                    label="Mode of Delivery"
                                                >
                                                    <MenuItem value="pickup">Pickup (Free)</MenuItem>
                                                    <MenuItem value="delivery">Delivery (+₱{shippingFee.toFixed(2)})</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                id="notes"
                                                name="notes"
                                                label="Delivery Notes (optional)"
                                                variant="outlined"
                                                multiline
                                                rows={3}
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>

                            <Card sx={{ mb: 4, boxShadow: 3 }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                        <Payment sx={{ mr: 2, color: 'secondary.main', fontSize: 30 }} />
                                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Payment Method</Typography>
                                    </Box>

                                    <FormControl component="fieldset" fullWidth>
                                        <RadioGroup name="paymentMethod">
                                            <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
                                                <FormControlLabel
                                                    value="e-wallet"
                                                    control={<Radio />}
                                                    label={
                                                        <Box sx={{ ml: 1 }}>
                                                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>E-Wallet</Typography>
                                                            <Typography variant="body2" color="text.secondary">Pay with GCash, PayMaya, etc.</Typography>
                                                        </Box>
                                                    }
                                                />
                                            </Paper>
                                            <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
                                                <FormControlLabel
                                                    value="bank-transfer"
                                                    control={<Radio />}
                                                    label={
                                                        <Box sx={{ ml: 1 }}>
                                                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Bank Transfer</Typography>
                                                            <Typography variant="body2" color="text.secondary">BPI, BDO, Metrobank, etc.</Typography>
                                                        </Box>
                                                    }
                                                />
                                            </Paper>
                                            <Paper elevation={2} sx={{ p: 2 }}>
                                                <FormControlLabel
                                                    value="cash"
                                                    control={<Radio />}
                                                    label={
                                                        <Box sx={{ ml: 1 }}>
                                                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Cash on Delivery</Typography>
                                                            <Typography variant="body2" color="text.secondary">Pay when you receive your order</Typography>
                                                        </Box>
                                                    }
                                                />
                                            </Paper>
                                        </RadioGroup>
                                    </FormControl>
                                </CardContent>
                            </Card>

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    sx={{
                                        px: 4,
                                        py: 1.5,
                                        fontSize: '1rem',
                                        fontWeight: 'bold',
                                        backgroundColor: 'primary.main',
                                        '&:hover': {
                                            backgroundColor: 'secondary.main',
                                        }
                                    }}
                                >
                                    Place Order
                                </Button>
                            </Box>
                        </Form>
                    </Grid>

                    {/* Right Column - Help and Additional Info */}
                    <Grid item xs={12} md={5}>
                        <Card sx={{ mb: 4, boxShadow: 3 }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <Help sx={{ mr: 2, color: 'secondary.main', fontSize: 30 }} />
                                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Need Help?</Typography>
                                </Box>

                                <Stack spacing={2}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Email sx={{ mr: 2, color: 'text.secondary' }} />
                                        <Typography>support@example.com</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Phone sx={{ mr: 2, color: 'text.secondary' }} />
                                        <Typography>(123) 456-7890</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Home sx={{ mr: 2, color: 'text.secondary' }} />
                                        <Typography>123 Store St, City, Country</Typography>
                                    </Box>
                                </Stack>

                                <Typography variant="body2" sx={{ mt: 3, color: 'text.secondary' }}>
                                    Our customer service team is available Monday to Friday, 9AM to 5PM.
                                </Typography>
                            </CardContent>
                        </Card>

                        <Card sx={{ mb: 4, boxShadow: 3 }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Delivery Information</Typography>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    Standard delivery takes 3-5 business days. Express delivery available for an additional fee.
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    Free pickup available at our main store location.
                                </Typography>
                            </CardContent>
                        </Card>

                        <Card sx={{ mb: 4, boxShadow: 3 }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Return Policy</Typography>
                                <Typography variant="body2">
                                    We accept returns within 30 days of purchase. Items must be unused and in original packaging.
                                </Typography>
                            </CardContent>
                        </Card>

                        <Card sx={{ boxShadow: 3 }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Secure Checkout</Typography>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    Your payment information is processed securely. We do not store your credit card details.
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <img src="https://via.placeholder.com/50x30?text=VISA" alt="Visa" />
                                    <img src="https://via.placeholder.com/50x30?text=MC" alt="Mastercard" />
                                    <img src="https://via.placeholder.com/50x30?text=PP" alt="PayPal" />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
            <Footer />

            {/* Success Dialog */}
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Order Successful"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Your order has been successfully placed!
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} autoFocus>
                        Return Home
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default Checkout;
