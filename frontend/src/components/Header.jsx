import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
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
    Container,
    Badge
} from '@mui/material';
import { 
    ShoppingCart, 
    AccountCircle, 
    ExitToApp, 
    ListAlt, 
    Notifications as NotificationsIcon,
    Close as CloseIcon 
} from '@mui/icons-material';
import { getUserOrders } from '../services/api';

export default function Header() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [lastCheckedOrders, setLastCheckedOrders] = useState({});
    
    // Move useRef to the top level of the component
    const orderStatusRef = useRef(lastCheckedOrders);
    
    // Update the ref whenever lastCheckedOrders changes
    useEffect(() => {
        orderStatusRef.current = lastCheckedOrders;
    }, [lastCheckedOrders]);

    // Load user data and notification state from localStorage
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }

        // Load saved notifications
        const savedNotifications = localStorage.getItem('notifications');
        if (savedNotifications) {
            const parsedNotifications = JSON.parse(savedNotifications);
            setNotifications(parsedNotifications);
            setUnreadCount(parsedNotifications.filter(n => !n.read).length);
        }

        // Load saved order status data
        const savedLastChecked = localStorage.getItem('lastCheckedOrders');
        if (savedLastChecked) {
            setLastCheckedOrders(JSON.parse(savedLastChecked));
        }
    }, []);

    // Save notification state to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }, [notifications]);

    // Save last checked order status to localStorage
    useEffect(() => {
        localStorage.setItem('lastCheckedOrders', JSON.stringify(lastCheckedOrders));
    }, [lastCheckedOrders]);

    // Poll for order status changes (only for customer users)
    useEffect(() => {
        if (!user || user.role !== 'customer') return;

        const checkForOrderUpdates = async () => {
            try {
                const response = await getUserOrders();
                const currentOrders = response.data;
                
                // Create local updates object to batch all changes
                const statusUpdates = {};
                let hasNewNotifications = false;
                
                // Check for status changes
                currentOrders.forEach(order => {
                    const orderId = order.id;
                    const currentStatus = order.status;
                    const previousStatus = orderStatusRef.current[orderId];
                    
                    // Only check orders that have a previous status and have changed
                    if (previousStatus && previousStatus !== currentStatus) {
                        // Create appropriate notification based on new status
                        if (currentStatus === 'out_for_delivery') {
                            // Create out for delivery notification
                            const newNotification = {
                                id: `order-${orderId}-${Date.now()}`,
                                title: 'Order Out for Delivery',
                                message: `Order #${order.orderNumber} is now out for delivery!`,
                                time: new Date(),
                                orderId: orderId,
                                read: false
                            };
                            
                            setNotifications(prev => [newNotification, ...prev]);
                            setUnreadCount(prev => prev + 1);
                            hasNewNotifications = true;
                        } else if (currentStatus === 'ready_for_pickup') {
                            // Create ready for pickup notification
                            const newNotification = {
                                id: `order-${orderId}-ready-${Date.now()}`,
                                title: 'Order Ready for Pickup',
                                message: `Order #${order.orderNumber} is now ready for pickup!`,
                                time: new Date(),
                                orderId: orderId,
                                read: false
                            };
                            
                            setNotifications(prev => [newNotification, ...prev]);
                            setUnreadCount(prev => prev + 1);
                            hasNewNotifications = true;
                        } else if (currentStatus === 'completed') {
                            // Create completion notification
                            const newNotification = {
                                id: `order-${orderId}-completed-${Date.now()}`,
                                title: 'Order Completed',
                                message: `Order #${order.orderNumber} has been completed!`,
                                time: new Date(),
                                orderId: orderId,
                                read: false
                            };
                            
                            setNotifications(prev => [newNotification, ...prev]);
                            setUnreadCount(prev => prev + 1);
                            hasNewNotifications = true;
                        }
                    }
                    
                    // Store update locally
                    statusUpdates[orderId] = currentStatus;
                });
                
                // Batch update the ref and state if needed
                if (Object.keys(statusUpdates).length > 0) {
                    // Update the ref immediately
                    orderStatusRef.current = {
                        ...orderStatusRef.current,
                        ...statusUpdates
                    };
                    
                    // Update the state (for persistence to localStorage) but not in the dependency array
                    setLastCheckedOrders(prev => ({
                        ...prev,
                        ...statusUpdates
                    }));
                }
            } catch (error) {
                console.error('Error checking for order updates:', error);
            }
        };
        
        // Check immediately on mount
        checkForOrderUpdates();
        
        // Set up polling every 30 seconds
        const intervalId = setInterval(checkForOrderUpdates, 30000);
        
        return () => clearInterval(intervalId);
        
    }, [user]); // Keep only user in the dependency array

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
        // If navigating to orders, mark all notifications as read
        if (path === '/orders') {
            markAllNotificationsAsRead();
        }
        
        handleClose();
        navigate(path);
    };
    
    // Mark all notifications as read
    const markAllNotificationsAsRead = () => {
        setNotifications(prev => 
            prev.map(notification => ({ ...notification, read: true }))
        );
        setUnreadCount(0);
    };

    const handleDeleteNotification = (notificationId, event) => {
        // Stop propagation to prevent menu item click
        event.stopPropagation();
        
        // Check if notification was unread before deleting
        const notificationToDelete = notifications.find(n => n.id === notificationId);
        const wasUnread = notificationToDelete && !notificationToDelete.read;
        
        // Remove notification from state
        setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
        
        // Decrease unread count if needed
        if (wasUnread) {
            setUnreadCount(prev => Math.max(0, prev - 1));
        }
    };

    return (
        <AppBar
            position="static"
            elevation={0}
            sx={{
                mb: 2,
                py: 0.5,
            }}
        >
            <Container maxWidth="xl">
                <Toolbar
                    disableGutters
                    sx={{
                        justifyContent: 'space-between',
                        minHeight: '48px',
                    }}
                >
                    <Link href="/" underline="none">
                        <Box
                            component="img"
                            src={'http://localhost:3000/images/merca-white.jpeg'}
                            alt="Merca Finds Logo"
                            sx={{
                                height: 80,
                                width: 'auto',
                            }}
                        />
                    </Link>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Link href="/" underline="hover" color="text.primary">
                            <Typography variant="body1">Home</Typography>
                        </Link>

                        {!user ? (
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => navigate('/login')}
                                startIcon={<AccountCircle />}
                                size="small"
                            >
                                Login
                            </Button>
                        ) : (
                            <>
                                {/* Show badge on avatar if there are notifications */}
                                <Badge
                                    badgeContent={unreadCount}
                                    color="error"
                                    overlap="circular"
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                >
                                    <IconButton
                                        onClick={handleMenu}
                                        size="small"
                                        sx={{ ml: 1 }}
                                        aria-controls={open ? 'account-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={open ? 'true' : undefined}
                                    >
                                        <Avatar sx={{ width: 28, height: 28, bgcolor: 'secondary.main' }}>
                                            {user.fullName ? user.fullName.charAt(0).toUpperCase() : ""}
                                        </Avatar>
                                    </IconButton>
                                </Badge>

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
                                            
                                            {/* Show badge on Orders menu item */}
                                            <MenuItem onClick={() => handleNavigate('/orders')}>
                                                <ListAlt sx={{ mr: 1 }} /> Orders
                                                {unreadCount > 0 && (
                                                    <Badge 
                                                        badgeContent={unreadCount} 
                                                        color="error" 
                                                        sx={{ ml: 'auto' }}
                                                    />
                                                )}
                                            </MenuItem>
                                            
                                            {/* Show recent notifications if any */}
                                            {notifications.length > 0 && (
                                                <>
                                                    <Divider />
                                                    <Box sx={{ px: 2, py: 1 }}>
                                                        <Typography 
                                                            variant="subtitle2" 
                                                            color="text.secondary"
                                                            sx={{ mb: 1 }}
                                                        >
                                                            Recent Notifications
                                                        </Typography>
                                                        
                                                        {notifications.slice(0, 2).map(notification => (
                                                            <Box 
                                                                key={notification.id}
                                                                sx={{ 
                                                                    p: 1,
                                                                    mb: 1,
                                                                    borderRadius: 1,
                                                                    bgcolor: notification.read ? 'transparent' : 'action.hover',
                                                                    borderLeft: notification.read ? 'none' : '3px solid',
                                                                    borderColor: 'primary.main',
                                                                    position: 'relative', // Add this for positioning the delete button
                                                                }}
                                                            >
                                                                <Typography variant="body2" sx={{ fontWeight: 'bold', pr: 4 }}>
                                                                    {notification.title}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {notification.message}
                                                                </Typography>
                                                                
                                                                {/* Delete button */}
                                                                <IconButton 
                                                                    size="small" 
                                                                    sx={{ 
                                                                        position: 'absolute', 
                                                                        top: 4, 
                                                                        right: 4,
                                                                        p: 0.5,
                                                                        '&:hover': {
                                                                            backgroundColor: 'rgba(0,0,0,0.08)'
                                                                        }
                                                                    }}
                                                                    onClick={(e) => handleDeleteNotification(notification.id, e)}
                                                                >
                                                                    <CloseIcon fontSize="small" />
                                                                </IconButton>
                                                            </Box>
                                                        ))}
                                                        
                                                        {notifications.length > 2 && (
                                                            <Box sx={{ textAlign: 'center', mt: 1 }}>
                                                                <Button 
                                                                    size="small"
                                                                    onClick={() => handleNavigate('/customer/orders')}
                                                                >
                                                                    View All ({notifications.length})
                                                                </Button>
                                                            </Box>
                                                        )}
                                                    </Box>
                                                </>
                                            )}
                                            
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

