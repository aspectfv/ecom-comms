import { useLoaderData, useNavigate } from 'react-router-dom';
import { removeFromCart } from '../services/api';
import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Grid,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Container
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Header from './Header';
import Footer from './Footer';

function Cart() {
    const cartData = useLoaderData();
    const items = cartData.items || [];
    const subtotal = items.reduce((total, item) => total + (item.itemId.price), 0);
    const navigate = useNavigate();

    const handleRemove = async (cartItemId) => {
        try {
            await removeFromCart(cartItemId);
            navigate(0);
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
                <Typography variant="h2" component="h1" gutterBottom>
                    Shopping Cart
                </Typography>

                {items.length === 0 ? (
                    <Card elevation={0} sx={{ p: 3 }}>
                        <Typography variant="body1">Your cart is empty.</Typography>
                    </Card>
                ) : (
                    <>
                        <TableContainer component={Paper} elevation={0} sx={{ mb: 4 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Product Name</TableCell>
                                        <TableCell align="right">Price</TableCell>
                                        <TableCell align="right">Total</TableCell>
                                        <TableCell align="right">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {items.map((item) => (
                                        <TableRow key={item._id}>
                                            <TableCell>
                                                <Typography variant="body1">{item.itemId.name}</Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                ₱{item.itemId.price.toFixed(2)}
                                            </TableCell>
                                            <TableCell align="right">
                                                ₱{(item.itemId.price).toFixed(2)}
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton
                                                    onClick={() => handleRemove(item.itemId.id)}
                                                    color="secondary"
                                                    aria-label="remove"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Grid container justifyContent="flex-end" spacing={4}>
                            <Grid item xs={12} md={4}>
                                <Card elevation={0}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Order Summary
                                        </Typography>
                                        <Divider sx={{ my: 2 }} />
                                        <Box display="flex" justifyContent="space-between" mb={2}>
                                            <Typography variant="body1">Subtotal:</Typography>
                                            <Typography variant="body1" fontWeight={500}>
                                                ₱{subtotal.toFixed(2)}
                                            </Typography>
                                        </Box>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            size="large"
                                            onClick={() => navigate('/checkout')}
                                            sx={{ mt: 2 }}
                                        >
                                            Proceed to Checkout
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </>
                )}
            </Container>
            <Footer />
        </Box>
    );
}

export default Cart;
