import { useLoaderData, Form } from 'react-router-dom';
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
    Grid
} from '@mui/material';
import { LocalShipping, Payment, ShoppingCart } from '@mui/icons-material';
import Header from './Header'
import Footer from './Footer'

function Checkout() {
    const { items = [] } = useLoaderData();
    const subtotal = items.reduce((total, item) => total + (item.itemId.price * item.quantity), 0);

    return (
        <>
            <Header />
            <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
                <Typography variant="h1" gutterBottom>
                    Checkout
                </Typography>

                <Card sx={{ mb: 4 }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <ShoppingCart sx={{ mr: 1, color: 'secondary.main' }} />
                            <Typography variant="h2">Your Items</Typography>
                        </Box>

                        <List>
                            {items.map((item) => (
                                <ListItem key={item.itemId.id} sx={{ px: 0 }}>
                                    <ListItemText
                                        primary={`${item.itemId.name} x ${item.quantity}`}
                                        secondary={`$${item.itemId.price.toFixed(2)} each`}
                                    />
                                    <Typography>${(item.itemId.price * item.quantity).toFixed(2)}</Typography>
                                </ListItem>
                            ))}
                        </List>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body1">Subtotal:</Typography>
                            <Typography variant="body1">${subtotal.toFixed(2)}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                            <Typography variant="h6">Total:</Typography>
                            <Typography variant="h6">${subtotal.toFixed(2)}</Typography>
                        </Box>
                    </CardContent>
                </Card>

                <Form method="post">
                    <Card sx={{ mb: 4 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <LocalShipping sx={{ mr: 1, color: 'secondary.main' }} />
                                <Typography variant="h2">Delivery Information</Typography>
                            </Box>

                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        id="fullName"
                                        name="fullName"
                                        label="Full Name"
                                        variant="outlined"
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
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        id="apartment"
                                        name="apartment"
                                        label="Apartment, Floor, etc. (optional)"
                                        variant="outlined"
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
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth required>
                                        <InputLabel id="deliveryMode-label">Mode of Delivery</InputLabel>
                                        <Select
                                            labelId="deliveryMode-label"
                                            id="deliveryMode"
                                            name="deliveryMode"
                                            label="Mode of Delivery"
                                        >
                                            <MenuItem value="pickup">Pickup</MenuItem>
                                            <MenuItem value="delivery">Delivery</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    <Card sx={{ mb: 4 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Payment sx={{ mr: 1, color: 'secondary.main' }} />
                                <Typography variant="h2">Payment Method</Typography>
                            </Box>

                            <FormControl component="fieldset">
                                <RadioGroup name="paymentMethod">
                                    <FormControlLabel
                                        value="e-wallet"
                                        control={<Radio required />}
                                        label="E-Wallet"
                                    />
                                    <FormControlLabel
                                        value="bank-transfer"
                                        control={<Radio />}
                                        label="Bank Transfer"
                                    />
                                    <FormControlLabel
                                        value="cash"
                                        control={<Radio />}
                                        label="Cash"
                                    />
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
            </Box>
            <Footer />
        </>
    );
}

export default Checkout;

