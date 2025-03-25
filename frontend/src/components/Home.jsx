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
    Typography
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
            }}
        >
            <CardMedia
                component="img"
                height="200"
                image={item.images[0] || 'https://placehold.co/300x200?text=No+Image'}
                alt={item.name}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h3" gutterBottom>
                    {item.name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    ${item.price.toFixed(2)}
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
                <Typography variant="h1" gutterBottom>
                    Welcome to Merca Finds!
                </Typography>

                <Paper sx={{ p: 3, mb: 4 }}>
                    <Typography variant="h2" gutterBottom>
                        Categories
                    </Typography>

                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                            textColor="primary"
                            indicatorColor="primary"
                        >
                            <Tab label="Pre-loved Items" value="preloved" />
                            <Tab label="Brand New Products" value="brandnew" />
                        </Tabs>
                    </Box>

                    {activeTab === 'preloved' && (
                        <Grid container spacing={3}>
                            {prelovedItems.map(item => (
                                <Grid item key={item.id} xs={12} sm={6} md={4} lg={3}>
                                    <ItemCard item={item} />
                                </Grid>
                            ))}
                        </Grid>
                    )}

                    {activeTab === 'brandnew' && (
                        <Grid container spacing={3}>
                            {brandnewItems.map(item => (
                                <Grid item key={item.id} xs={12} sm={6} md={4} lg={3}>
                                    <ItemCard item={item} />
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Paper>

                <Paper sx={{ p: 3, mb: 4 }}>
                    <Typography variant="h2" gutterBottom>
                        Pre-loved Items
                    </Typography>
                    <Grid container spacing={3}>
                        {prelovedItems.slice(0, 4).map(item => (
                            <Grid item key={item.id} xs={12} sm={6} md={3}>
                                <ItemCard item={item} />
                            </Grid>
                        ))}
                    </Grid>
                </Paper>

                <Paper sx={{ p: 3 }}>
                    <Typography variant="h2" gutterBottom>
                        Brand New Products
                    </Typography>
                    <Grid container spacing={3}>
                        {brandnewItems.slice(0, 4).map(item => (
                            <Grid item key={item.id} xs={12} sm={6} md={3}>
                                <ItemCard item={item} />
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            </Container>

            <Footer />
        </Box>
    );
}

