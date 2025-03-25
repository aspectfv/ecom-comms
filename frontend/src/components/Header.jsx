import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Link,
    Avatar,
    Menu,
    MenuItem,
    Divider,
    IconButton,
    Container
} from '@mui/material';
import { ShoppingCart, AccountCircle, ExitToApp, ListAlt } from '@mui/icons-material';

// Import your logo image (make sure to have the file in your project)

export default function Header() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        setAnchorEl(null);
        navigate('/home');
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNavigate = (path) => {
        handleClose();
        navigate(path);
    };

    return (
        <AppBar
            position="static"
            elevation={0}
            sx={{
                mb: 2, // Reduced margin bottom
                py: 0.5, // Reduced vertical padding
            }}
        >
            <Container maxWidth="xl">
                <Toolbar
                    disableGutters
                    sx={{
                        justifyContent: 'space-between',
                        minHeight: '48px', // Reduced toolbar height
                    }}
                >
                    <Link href="/" underline="none">
                        {/* Replace text with logo image */}
                        <Box
                            component="img"
                            src={'http://localhost:3000/images/merca-white.jpeg'}
                            alt="Merca Finds Logo"
                            sx={{
                                height: 80, // Adjust height as needed
                                width: 'auto',
                            }}
                        />
                    </Link>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}> {/* Reduced gap */}
                        <Link href="/" underline="hover" color="text.primary">
                            <Typography variant="body1">Home</Typography>
                        </Link>

                        {!user ? (
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => navigate('/login')}
                                startIcon={<AccountCircle />}
                                size="small" // Smaller button
                            >
                                Login
                            </Button>
                        ) : (
                            <>
                                <IconButton
                                    onClick={handleMenu}
                                    size="small"
                                    sx={{ ml: 1 }} // Reduced margin
                                    aria-controls={open ? 'account-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                >
                                    <Avatar sx={{ width: 28, height: 28, bgcolor: 'secondary.main' }}> {/* Smaller avatar */}
                                        {user.fullName ? user.fullName.charAt(0).toUpperCase() : ""}
                                    </Avatar>
                                </IconButton>

                                <Menu
                                    anchorEl={anchorEl}
                                    id="account-menu"
                                    open={open}
                                    onClose={handleClose}
                                    PaperProps={{
                                        elevation: 0,
                                        sx: {
                                            overflow: 'visible',
                                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                                            mt: 1,
                                            '& .MuiAvatar-root': {
                                                width: 28,
                                                height: 28,
                                                ml: -0.5,
                                                mr: 1,
                                            },
                                        },
                                    }}
                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                >
                                    <MenuItem onClick={handleClose}>
                                        <Avatar /> {user.fullName}
                                    </MenuItem>
                                    <Divider />

                                    {user.role === 'customer' && (
                                        <div>
                                            <MenuItem onClick={() => handleNavigate('/cart')}>
                                                <ShoppingCart sx={{ mr: 1 }} /> Shopping Cart
                                            </MenuItem>
                                            <MenuItem onClick={() => handleNavigate('/orders')}>
                                                <ListAlt sx={{ mr: 1 }} /> Orders
                                            </MenuItem>
                                            <Divider />
                                        </div>
                                    )}

                                    <MenuItem onClick={handleLogout}>
                                        <ExitToApp sx={{ mr: 1 }} /> Logout
                                    </MenuItem>
                                </Menu>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

