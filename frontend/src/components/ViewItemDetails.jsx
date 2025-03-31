import { useState, useEffect } from 'react';
import { useLoaderData, Link } from 'react-router-dom';
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
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import Header from './Header';
import Footer from './Footer';

export default function ViewItemDetails() {
    const item = useLoaderData();
    const [user, setUser] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleNextImage = () => {
        if (item.images && item.images.length > 0) {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % item.images.length);
        }
    };

    const handlePrevImage = () => {
        if (item.images && item.images.length > 0) {
            setCurrentImageIndex((prevIndex) => (prevIndex - 1 + item.images.length) % item.images.length);
        }
    };

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

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
            <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
                <Typography variant="h3" component="h1" fontWeight={600} mb={4}>
                    Item Details
                </Typography>
                
                <Box mb={4}>
                    <Button 
                        component={Link} 
                        to={`/${user?.role}/inventory`}
                        startIcon={<ArrowBackIcon />}
                        variant="outlined"
                    >
                        Back to Inventory
                    </Button>
                </Box>
                
                <Card sx={{ mb: 4, p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
                        <Box>
                            <Typography variant="h4" component="h2" fontWeight={500}>
                                {item.name}
                            </Typography>
                            <Typography variant="body1" color="text.secondary" mt={1}>
                                <strong>Item Code:</strong> {item.itemCode}
                            </Typography>
                        </Box>
                        
                        <Box textAlign="right">
                            <Chip 
                                label={item.type === 'preloved' ? 'PRE-LOVED' : 'BRAND NEW'}
                                color={item.type === 'preloved' ? 'secondary' : 'primary'}
                                sx={{ 
                                    fontWeight: 500,
                                    fontSize: '0.875rem',
                                    px: 2,
                                    py: 0.5
                                }}
                            />
                        </Box>
                    </Box>
                    
                    <Divider sx={{ my: 3 }} />
                    
                    <Grid container spacing={4}>
                        {/* Item Images */}
                        <Grid item xs={12} md={6}>
                            <Typography variant="h5" component="h3" fontWeight={500} mb={2}>
                                Product Images
                            </Typography>
                            
                            {item.images && item.images.length > 0 ? (
                                <Box sx={{ position: 'relative' }}>
                                    <CardMedia
                                        component="img"
                                        image={item.images[currentImageIndex]}
                                        alt={item.name}
                                        sx={{ 
                                            height: 400, 
                                            objectFit: 'contain',
                                            borderRadius: 1,
                                            bgcolor: 'background.paper'
                                        }}
                                    />
                                    
                                    {item.images.length > 1 && (
                                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                            <Button 
                                                onClick={handlePrevImage}
                                                sx={{ minWidth: 40 }}
                                            >
                                                ‹
                                            </Button>
                                            
                                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                {item.images.map((_, index) => (
                                                    <Box
                                                        key={index}
                                                        onClick={() => setCurrentImageIndex(index)}
                                                        sx={{
                                                            width: 10,
                                                            height: 10,
                                                            borderRadius: '50%',
                                                            bgcolor: index === currentImageIndex ? 'primary.main' : 'grey.300',
                                                            cursor: 'pointer'
                                                        }}
                                                    />
                                                ))}
                                            </Box>
                                            
                                            <Button 
                                                onClick={handleNextImage}
                                                sx={{ minWidth: 40 }}
                                            >
                                                ›
                                            </Button>
                                        </Box>
                                    )}
                                </Box>
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
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <Typography variant="h5" component="h3" fontWeight={500} mb={2}>
                                Item Information
                            </Typography>
                            
                            <Box sx={{ '& > p': { mb: 1 } }}>
                                <Typography variant="body1">
                                    <strong>Price:</strong> ${item.price.toFixed(2)}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Category:</strong> {item.category}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Owner:</strong> {item.owner}
                                </Typography>
                                {item.type === 'preloved' && item.condition && (
                                    <Typography variant="body1">
                                        <strong>Condition:</strong> {item.condition}
                                    </Typography>
                                )}
                                <Typography variant="body1" sx={{ mt: 3 }}>
                                    <strong>Description:</strong>
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    {item.description || 'No description available'}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Card>
            </Container>
        </Box>
    );
}