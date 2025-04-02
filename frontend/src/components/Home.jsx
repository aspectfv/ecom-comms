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
    Chip,
    TextField,
    InputAdornment,
    MenuItem,
    FormControl,
    Select,
    IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
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
    const allItems = useLoaderData();
    const navigate = useNavigate();

    // Filter available items (items with status 'available' or no status field)
    const items = allItems.filter(item => 
        !item.status || item.status === 'available'
    );

    const [activeTab, setActiveTab] = useState('preloved');
    const [user, setUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [priceRange, setPriceRange] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    
    const categories = ['Electronics', 'Kids\' Costumes', 'Home Decor', 'Clothing', 'Furniture', 'General'];

    const filterItems = (items) => {
        return items.filter(item => {
            // Filter by search query
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));
            
            // Filter by category
            const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
            
            // Filter by price range
            let matchesPrice = true;
            if (priceRange === 'under1000') {
                matchesPrice = item.price < 1000;
            } else if (priceRange === '1000to5000') {
                matchesPrice = item.price >= 1000 && item.price <= 5000;
            } else if (priceRange === 'over5000') {
                matchesPrice = item.price > 5000;
            }
            
            return matchesSearch && matchesCategory && matchesPrice;
        });
    };

    const filteredPrelovedItems = filterItems(items.filter(item => item.type === 'preloved'));
    const filteredBrandnewItems = filterItems(items.filter(item => item.type === 'brandnew'));

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

    const clearFilters = () => {
        setSearchQuery('');
        setPriceRange('all');
        setSelectedCategory('all');
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
                        </Paper>

                        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
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

                            <Box sx={{ mb: 3 }}>
                                <TextField
                                    fullWidth
                                    placeholder="Search items by name or category..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    sx={{ mb: 2 }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                        endAdornment: searchQuery && (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setSearchQuery('')}>
                                                    <CloseIcon />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Button 
                                        startIcon={<FilterListIcon />} 
                                        onClick={() => setShowFilters(!showFilters)}
                                        variant="outlined"
                                    >
                                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                                    </Button>
                                    
                                    {(searchQuery || priceRange !== 'all' || selectedCategory !== 'all') && (
                                        <Button 
                                            variant="text"
                                            onClick={clearFilters}
                                        >
                                            Clear All Filters
                                        </Button>
                                    )}
                                </Box>
                                
                                {showFilters && (
                                    <Grid container spacing={2} sx={{ mb: 2 }}>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="body2" sx={{ mb: 1 }}>Category</Typography>
                                                <Select
                                                    value={selectedCategory}
                                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                                    displayEmpty
                                                >
                                                    <MenuItem value="all">All Categories</MenuItem>
                                                    {categories.map(category => (
                                                        <MenuItem key={category} value={category}>{category}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="body2" sx={{ mb: 1 }}>Price Range</Typography>
                                                <Select
                                                    value={priceRange}
                                                    onChange={(e) => setPriceRange(e.target.value)}
                                                    displayEmpty
                                                >
                                                    <MenuItem value="all">All Prices</MenuItem>
                                                    <MenuItem value="under1000">Under ₱1,000</MenuItem>
                                                    <MenuItem value="1000to5000">₱1,000 - ₱5,000</MenuItem>
                                                    <MenuItem value="over5000">Over ₱5,000</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                )}
                                
                                {(searchQuery || priceRange !== 'all' || selectedCategory !== 'all') && (
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                                        {searchQuery && (
                                            <Chip 
                                                label={`Search: "${searchQuery}"`} 
                                                onDelete={() => setSearchQuery('')}
                                                color="primary"
                                                variant="outlined"
                                            />
                                        )}
                                        {selectedCategory !== 'all' && (
                                            <Chip 
                                                label={`Category: ${selectedCategory}`} 
                                                onDelete={() => setSelectedCategory('all')}
                                                color="primary"
                                                variant="outlined"
                                            />
                                        )}
                                        {priceRange !== 'all' && (
                                            <Chip 
                                                label={`Price: ${priceRange === 'under1000' ? 'Under ₱1,000' : priceRange === '1000to5000' ? '₱1,000 - ₱5,000' : 'Over ₱5,000'}`} 
                                                onDelete={() => setPriceRange('all')}
                                                color="primary"
                                                variant="outlined"
                                            />
                                        )}
                                    </Box>
                                )}
                            </Box>

                            {activeTab === 'preloved' && (
                                <>
                                    {filteredPrelovedItems.length > 0 ? (
                                        <Grid container spacing={3}>
                                            {filteredPrelovedItems.map(item => (
                                                <Grid item key={item.id} xs={12} sm={6}>
                                                    <ItemCard item={item} />
                                                </Grid>
                                            ))}
                                        </Grid>
                                    ) : (
                                        <Box sx={{ textAlign: 'center', py: 4 }}>
                                            <Typography variant="h6" color="text.secondary">
                                                No pre-loved items match your search
                                            </Typography>
                                        </Box>
                                    )}
                                </>
                            )}

                            {activeTab === 'brandnew' && (
                                <>
                                    {filteredBrandnewItems.length > 0 ? (
                                        <Grid container spacing={3}>
                                            {filteredBrandnewItems.map(item => (
                                                <Grid item key={item.id} xs={12} sm={6}>
                                                    <ItemCard item={item} />
                                                </Grid>
                                            ))}
                                        </Grid>
                                    ) : (
                                        <Box sx={{ textAlign: 'center', py: 4 }}>
                                            <Typography variant="h6" color="text.secondary">
                                                No brand new items match your search
                                            </Typography>
                                        </Box>
                                    )}
                                </>
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
                                            cursor: 'pointer',
                                            '&:hover': {
                                                backgroundColor: 'grey.100',
                                                transform: 'translateX(4px)'
                                            }
                                        }}
                                        onClick={() => {
                                            setSelectedCategory(category);
                                            setShowFilters(true);
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
                                {[...items.filter(item => item.type === 'preloved'), ...items.filter(item => item.type === 'brandnew')].slice(0, 2).map(item => (
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
