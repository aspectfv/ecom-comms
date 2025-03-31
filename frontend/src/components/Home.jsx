import { useState, useEffect } from 'react';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Container,
    Grid,
    Paper,
    Tab,
    Tabs,
    Typography,
    Divider,
    Stack,
    Chip
} from '@mui/material';
import Header from './Header';
import Footer from './Footer';

function ItemCard({ item }) {
    return (
        <Card
            component={Link}
            to={`/item/${item.id}`}
            sx={{
                textDecoration: 'none',
                color: 'inherit',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow: 3
                }
            }}
        >
            <CardMedia
                component="img"
                height="200"
                image={item.images[0] || 'https://placehold.co/300x200?text=No+Image'}
                alt={item.name}
                sx={{ objectFit: 'cover' }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="h6" component="h3" noWrap>
                        {item.name}
                    </Typography>
                    <Chip
                        label={item.type === 'preloved' ? 'Pre-loved' : 'Brand New'}
                        size="small"
                        color={item.type === 'preloved' ? 'secondary' : 'primary'}
                    />
                </Stack>
                <Typography variant="body2" color="text.secondary" mb={1}>
                    {item.category || 'General'}
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                    ₱{item.price.toFixed(2)}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default function Home() {
    const items = useLoaderData();
    const prelovedItems = items.filter(item => item.type === 'preloved');
    const brandnewItems = items.filter(item => item.type === 'brandnew');
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('preloved');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/home');
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />

            <Container component="main" sx={{ py: 4, flexGrow: 1 }}>
                <Grid container spacing={4}>
                    {/* Left Column - Main Content */}
                    <Grid item xs={12} md={8}>
                        <Paper sx={{ p: 4, mb: 4, borderRadius: 2 }}>
                            <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                                Welcome to Merca Finds!
                            </Typography>
                            <Typography variant="body1" paragraph>
                                Discover amazing deals on pre-loved items and brand new products.
                                Find what you need at prices you'll love.
                            </Typography>
                            <Button
                                variant="contained"
                                size="large"
                                sx={{ mt: 2 }}
                                component={Link}
                                to="/home"
                            >
                                Browse All Items
                            </Button>
                        </Paper>

                        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                    Featured Items
                                </Typography>
                                <Tabs
                                    value={activeTab}
                                    onChange={handleTabChange}
                                    textColor="primary"
                                    indicatorColor="primary"
                                >
                                    <Tab label="Pre-loved" value="preloved" />
                                    <Tab label="Brand New" value="brandnew" />
                                </Tabs>
                            </Box>

                            {activeTab === 'preloved' && (
                                <Grid container spacing={3}>
                                    {prelovedItems.map(item => (
                                        <Grid item key={item.id} xs={12} sm={6}>
                                            <ItemCard item={item} />
                                        </Grid>
                                    ))}
                                </Grid>
                            )}

                            {activeTab === 'brandnew' && (
                                <Grid container spacing={3}>
                                    {brandnewItems.map(item => (
                                        <Grid item key={item.id} xs={12} sm={6}>
                                            <ItemCard item={item} />
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </Paper>
                    </Grid>

                    {/* Right Column - Sidebar */}
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                                Top Categories
                            </Typography>
                            <Stack spacing={2}>
                                {['Electronics', `Kids' Costumes`, 'Home Decor', 'Clothing', 'Furniture'].map((category) => (
                                    <Box
                                        key={category}
                                        sx={{
                                            p: 2,
                                            borderLeft: '4px solid',
                                            borderColor: 'primary.main',
                                            backgroundColor: 'grey.50',
                                            display: 'flex',
                                            alignItems: 'center',
                                            transition: '0.3s',
                                            '&:hover': {
                                                backgroundColor: 'grey.100',
                                                transform: 'translateX(4px)'
                                            }
                                        }}
                                    >
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {category}
                                        </Typography>
                                    </Box>
                                ))}
                            </Stack>
                        </Paper>

                        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                                Recently Viewed
                            </Typography>
                            <Grid container spacing={2}>
                                {[...prelovedItems, ...brandnewItems].slice(0, 2).map(item => (
                                    <Grid item key={item.id} xs={12}>
                                        <ItemCard item={item} />
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>

                        <Paper sx={{ p: 3, borderRadius: 2 }}>
                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                                About Merca Finds
                            </Typography>
                            <Typography variant="body1" paragraph>
                                We're dedicated to helping you find great deals on quality items,
                                whether they're pre-loved treasures or brand new products.
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            <Footer />
        </Box>
    );
}

