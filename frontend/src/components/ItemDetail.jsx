import { useState, useEffect } from 'react';
import { useLoaderData, Link, Form } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    CardMedia,
    Grid,
    Container,
    Divider,
    Chip,
    Snackbar,
    Alert,
    Paper
} from '@mui/material';
import Header from './Header';
import Footer from './Footer';

export default function ItemDetail() {
    const item = useLoaderData();
    const [user, setUser] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    // Check if the item is available for purchase
    const isAvailable = !item.status || item.status === 'available';

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            (prevIndex + 1) % item.images.length
        );
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            (prevIndex - 1 + item.images.length) % item.images.length
        );
    };

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleAddToCart = (e) => {
        // Prevent form submission if item is not available
        if (!isAvailable) {
            e.preventDefault();
            return;
        }
        setOpenSnackbar(true);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    if (!item) {
        return (
            <Container>
                <Typography variant="h4" component="h1" gutterBottom>
                    Item not found
                </Typography>
            </Container>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
                <Grid container spacing={4}>
                    {/* Images Section */}
                    <Grid item xs={12} md={6}>
                        <Card elevation={0} sx={{ borderRadius: 2, position: 'relative' }}>
                            {item.images && item.images.length > 0 ? (
                                <>
                                    <CardMedia
                                        component="img"
                                        image={item.images[currentImageIndex]}
                                        alt={item.name}
                                        sx={{
                                            width: '100%',
                                            height: 'auto',
                                            borderRadius: 2,
                                            aspectRatio: '1/1',
                                            objectFit: 'contain',
                                            ...(item.status === 'sold' && {
                                                opacity: 0.7,
                                                filter: 'grayscale(50%)'
                                            })
                                        }}
                                    />
                                    {item.images.length > 1 && (
                                        <>
                                            <Button
                                                onClick={handlePrevImage}
                                                sx={{
                                                    position: 'absolute',
                                                    left: 8,
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                                    color: 'white',
                                                    minWidth: 'unset',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(0,0,0,0.7)'
                                                    }
                                                }}
                                            >
                                                ‹
                                            </Button>
                                            <Button
                                                onClick={handleNextImage}
                                                sx={{
                                                    position: 'absolute',
                                                    right: 8,
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                                    color: 'white',
                                                    minWidth: 'unset',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(0,0,0,0.7)'
                                                    }
                                                }}
                                            >
                                                ›
                                            </Button>
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                mt: 1,
                                                gap: 1
                                            }}>
                                                {item.images.map((_, index) => (
                                                    <Box
                                                        key={index}
                                                        onClick={() => setCurrentImageIndex(index)}
                                                        sx={{
                                                            width: 8,
                                                            height: 8,
                                                            borderRadius: '50%',
                                                            backgroundColor: index === currentImageIndex
                                                                ? 'primary.main'
                                                                : 'grey.400',
                                                            cursor: 'pointer'
                                                        }}
                                                    />
                                                ))}
                                            </Box>
                                        </>
                                    )}
                                </>
                            ) : (
                                <Box
                                    sx={{
                                        height: 300,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: 'background.paper',
                                        borderRadius: 2
                                    }}
                                >
                                    <Typography variant="body1" color="text.secondary">
                                        No images available
                                    </Typography>
                                </Box>
                            )}
                        </Card>
                    </Grid>

                    {/* Details Section */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h3" component="h1" gutterBottom>
                                    {item.name}
                                </Typography>
                                
                                {/* Item Status Chip */}
                                {item.status && item.status !== 'available' && (
                                    <Chip 
                                        label={item.status === 'ordered' ? 'Currently Ordered' : 'Sold Out'}
                                        color={item.status === 'ordered' ? 'warning' : 'error'}
                                        sx={{ fontWeight: 'bold' }}
                                    />
                                )}
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                {item.category && (
                                    <Chip
                                        label={item.category}
                                        size="small"
                                        sx={{ backgroundColor: 'secondary.light' }}
                                    />
                                )}
                                <Chip
                                    label={item.type === 'preloved' ? 'Pre-loved' : 'Brand New'}
                                    size="small"
                                    color={item.type === 'preloved' ? 'secondary' : 'default'}
                                />
                            </Box>

                            <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                                ₱{item.price.toFixed(2)}
                            </Typography>

                            <Divider sx={{ my: 2 }} />

                            <Box>
                                <Typography variant="h5" component="h2" gutterBottom>
                                    Description
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    {item.description || 'No description available'}
                                </Typography>
                            </Box>

                            {item.type === 'preloved' && item.condition && (
                                <Box>
                                    <Typography variant="h6" component="h3" gutterBottom>
                                        Condition
                                    </Typography>
                                    <Typography variant="body1">
                                        {item.condition}
                                    </Typography>
                                </Box>
                            )}

                            {/* Display availability message */}
                            {!isAvailable && (
                                <Paper 
                                    elevation={0} 
                                    sx={{ 
                                        p: 2, 
                                        bgcolor: item.status === 'ordered' ? 'warning.light' : 'error.light',
                                        borderRadius: 1,
                                        mb: 2
                                    }}
                                >
                                    <Typography variant="body1" fontWeight="medium" color={item.status === 'ordered' ? 'warning.dark' : 'error.dark'}>
                                        {item.status === 'ordered' 
                                            ? "This item is currently not available."
                                            : "This item has been sold and is no longer available."}
                                    </Typography>
                                </Paper>
                            )}

                            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                                <Form method="post">
                                    <input type="hidden" name="actionType" value="buyNow" />
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        disabled={!isAvailable}
                                        sx={{
                                            backgroundColor: 'primary.main',
                                            '&:hover': {
                                                backgroundColor: 'primary.main',
                                                opacity: 0.9
                                            },
                                            '&.Mui-disabled': {
                                                backgroundColor: 'action.disabledBackground',
                                                color: 'action.disabled'
                                            }
                                        }}
                                    >
                                        Buy Now
                                    </Button>
                                </Form>
                                <Form method="post" onSubmit={handleAddToCart}>
                                    <input type="hidden" name="actionType" value="addToCart" />
                                    <Button
                                        type="submit"
                                        variant="outlined"
                                        size="large"
                                        disabled={!isAvailable}
                                        sx={{
                                            borderColor: 'primary.main',
                                            color: 'primary.main',
                                            '&:hover': {
                                                borderColor: 'primary.main',
                                                backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                            },
                                            '&.Mui-disabled': {
                                                borderColor: 'action.disabled'
                                            }
                                        }}
                                    >
                                        Add to Cart
                                    </Button>
                                </Form>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
            <Footer />

            {/* Snackbar Notification */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Item added to cart successfully!
                </Alert>
            </Snackbar>
        </Box>
    );
}

