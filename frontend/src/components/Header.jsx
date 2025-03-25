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
import { ShoppingCart, AccountCircle, ExitToApp } from '@mui/icons-material';

export default function Header() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    // Check localStorage for user data on component mount
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    // Handle logout
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

    return (
        <AppBar position="static" elevation={0} sx={{ mb: 4 }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
                    <Link href="/" underline="none" color="inherit">
                        <Typography variant="h4" component="h1" fontWeight={600}>
                            Merca Finds
                        </Typography>
                    </Link>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Link href="/" underline="hover" color="text.primary">
                            <Typography variant="body1">Home</Typography>
                        </Link>

                        {!user ? (
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => navigate('/login')}
                                startIcon={<AccountCircle />}
                            >
                                Login
                            </Button>
                        ) : (
                            <>
                                <IconButton
                                    onClick={handleMenu}
                                    size="small"
                                    sx={{ ml: 2 }}
                                    aria-controls={open ? 'account-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                >
                                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                                        {user.fullName.charAt(0).toUpperCase()}
                                    </Avatar>
                                </IconButton>

                                <Menu
                                    anchorEl={anchorEl}
                                    id="account-menu"
                                    open={open}
                                    onClose={handleClose}
                                    onClick={handleClose}
                                    PaperProps={{
                                        elevation: 0,
                                        sx: {
                                            overflow: 'visible',
                                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                                            mt: 1.5,
                                            '& .MuiAvatar-root': {
                                                width: 32,
                                                height: 32,
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
                                        <>
                                            <MenuItem onClick={() => navigate('/cart')}>
                                                <ShoppingCart sx={{ mr: 1 }} /> Shopping Cart
                                            </MenuItem>
                                            <MenuItem onClick={() => navigate('/orders')}>
                                                <ShoppingCart sx={{ mr: 1 }} /> Orders
                                            </MenuItem>
                                            <Divider />
                                        </>
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

