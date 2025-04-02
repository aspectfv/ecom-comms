import { useLoaderData, Form, useNavigate, useSubmit } from 'react-router-dom';
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
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Alert,
    FormHelperText,
} from '@mui/material';
import { LocalShipping, Payment, ShoppingCart, Help, Email, Phone, Home, CloudUpload } from '@mui/icons-material';
import Header from './Header';
import Footer from './Footer';
import { useState, useEffect, useRef } from 'react';

function Checkout() {
    const { items = [] } = useLoaderData();
    const subtotal = items.reduce((total, item) => total + (item.itemId.price), 0);
    
    const [deliveryMode, setDeliveryMode] = useState('');
    const [shippingFee, setShippingFee] = useState(0);
    const [total, setTotal] = useState(subtotal);
    const [addressComplete, setAddressComplete] = useState(false);
    const [fullName, setFullName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [paymentProof, setPaymentProof] = useState(null);
    const [paymentProofPreview, setPaymentProofPreview] = useState('');
    const [uploadError, setUploadError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fileInputRef = useRef(null);
    const formRef = useRef(null);
    const submit = useSubmit();

    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    // Update shipping fee based on delivery mode
    useEffect(() => {
        if (deliveryMode === 'delivery') {
            setShippingFee(50);
        } else if (deliveryMode === 'pickup') {
            setShippingFee(0);
        }
    }, [deliveryMode]);

    // Update total when subtotal or shipping fee changes
    useEffect(() => {
        setTotal(subtotal + shippingFee);
    }, [subtotal, shippingFee]);

    // Check if address is complete
    useEffect(() => {
        setAddressComplete(
            fullName !== '' && 
            contactNumber !== '' && 
            street !== '' && 
            city !== '' && 
            deliveryMode !== ''
        );
    }, [fullName, contactNumber, street, city, deliveryMode]);

    // Clear error message after 5 seconds
    useEffect(() => {
        if (uploadError) {
            const timer = setTimeout(() => {
                setUploadError('');
            }, 5000);
            
            return () => clearTimeout(timer);
        }
    }, [uploadError]);

    const handleClose = () => {
        setOpen(false);
        navigate('/home');
    };

    const handleCancel = () => {
        navigate('/home');
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        
        // If e-wallet is selected but no proof is uploaded, show error
        if (paymentMethod === 'e-wallet' && !paymentProof) {
            setUploadError('Please upload proof of payment for E-wallet transactions');
            setIsSubmitting(false);
            return;
        }
        
        // Create a new FormData object from the form
        const formData = new FormData(formRef.current);
        
        // Manually add the payment proof file if it exists
        if (paymentProof && paymentMethod === 'e-wallet') {
            formData.append('paymentProof', paymentProof);
        }
        
        // Submit the form with the FormData
        submit(formData, {
            method: 'post',
            encType: 'multipart/form-data',
        });
        
        // Show success dialog after form submission
        setOpen(true);
    };

    const handleDeliveryModeChange = (event) => {
        setDeliveryMode(event.target.value);
    };

    const handlePaymentMethodChange = (event) => {
        setPaymentMethod(event.target.value);
        
        // Clear payment proof when switching away from e-wallet
        if (event.target.value !== 'e-wallet') {
            setPaymentProof(null);
            setPaymentProofPreview('');
            setUploadError('');
        }
    };

    const handlePaymentProofChange = (event) => {
        const file = event.target.files[0];
        
        if (!file) {
            return;
        }
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
            setUploadError('Please upload only image files (.jpg, .jpeg, .png, etc.)');
            return;
        }
        
        // Validate file size (limit to 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setUploadError('Image file is too large. Please upload files smaller than 5MB');
            return;
        }
        
        // Store the file object
        setPaymentProof(file);
        
        // Create preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
            setPaymentProofPreview(reader.result);
        };
        reader.onerror = () => {
            setUploadError('Failed to read the image file. Please try again.');
        };
        reader.readAsDataURL(file);
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleRemoveProof = () => {
        setPaymentProof(null);
        setPaymentProofPreview('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
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
                                                            ₱{item.itemId.price.toFixed(2)}
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
                                                ₱{(item.itemId.price).toFixed(2)}
                                            </Typography>
                                        </ListItem>
                                    ))}
                                </List>

                                <Divider sx={{ my: 2 }} />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body1">Subtotal:</Typography>
                                    <Typography variant="body1">₱{subtotal.toFixed(2)}</Typography>
                                </Box>
                                
                                {addressComplete && (
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body1">Shipping:</Typography>
                                        <Typography variant="body1">
                                            {deliveryMode === 'pickup' ? 'Free' : `₱${shippingFee.toFixed(2)}`}
                                        </Typography>
                                    </Box>
                                )}
                                
                                {addressComplete && (
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: '1px dashed #ddd' }}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total:</Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>₱{total.toFixed(2)}</Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>

                        <Form method="post" ref={formRef} encType="multipart/form-data" onSubmit={handleSubmit}>
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
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
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
                                                value={contactNumber}
                                                onChange={(e) => setContactNumber(e.target.value)}
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
                                                value={street}
                                                onChange={(e) => setStreet(e.target.value)}
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
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
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
                                                    value={deliveryMode}
                                                    onChange={handleDeliveryModeChange}
                                                >
                                                    <MenuItem value="pickup">Pickup (Free)</MenuItem>
                                                    <MenuItem value="delivery">Delivery (₱50.00 fixed fee)</MenuItem>
                                                </Select>
                                            </FormControl>
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
                                        <RadioGroup 
                                            name="paymentMethod" 
                                            value={paymentMethod}
                                            onChange={handlePaymentMethodChange}
                                        >
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
                                                {paymentMethod === 'e-wallet' && (
                                                    <Box sx={{ mt: 2, ml: 4 }}>
                                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                                            Please upload a screenshot of your payment receipt
                                                        </Typography>
                                                        
                                                        {/* Error message */}
                                                        {uploadError && (
                                                            <Alert severity="warning" sx={{ mb: 2 }}>
                                                                {uploadError}
                                                            </Alert>
                                                        )}
                                                        
                                                        <input
                                                            type="file"
                                                            id="paymentProof"
                                                            name="paymentProof"
                                                            accept="image/*"
                                                            onChange={handlePaymentProofChange}
                                                            style={{ display: 'none' }}
                                                            ref={fileInputRef}
                                                        />
                                                        
                                                        {!paymentProofPreview ? (
                                                            <Button
                                                                variant="outlined"
                                                                startIcon={<CloudUpload />}
                                                                onClick={triggerFileInput}
                                                                fullWidth
                                                                sx={{ mt: 1 }}
                                                                disabled={isSubmitting}
                                                            >
                                                                Upload Payment Receipt
                                                            </Button>
                                                        ) : (
                                                            <Box sx={{ mt: 2, position: 'relative' }}>
                                                                <img 
                                                                    src={paymentProofPreview}
                                                                    alt="Payment proof"
                                                                    style={{ 
                                                                        maxWidth: '100%', 
                                                                        maxHeight: '200px',
                                                                        borderRadius: '4px'
                                                                    }}
                                                                />
                                                                <Button
                                                                    variant="contained"
                                                                    color="error"
                                                                    size="small"
                                                                    onClick={handleRemoveProof}
                                                                    sx={{ 
                                                                        position: 'absolute',
                                                                        top: 8,
                                                                        right: 8,
                                                                        minWidth: 'auto'
                                                                    }}
                                                                    disabled={isSubmitting}
                                                                >
                                                                    ✕
                                                                </Button>
                                                            </Box>
                                                        )}
                                                        <FormHelperText>
                                                            Image file should be less than 5MB (.jpg, .jpeg, .png)
                                                        </FormHelperText>
                                                    </Box>
                                                )}
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

                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    onClick={handleCancel}
                                    sx={{
                                        px: 4,
                                        py: 1.5,
                                        fontSize: '1rem',
                                        fontWeight: 'bold',
                                    }}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
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
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Processing...' : 'Place Order'}
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
