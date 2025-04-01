import { Link, Outlet, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useState, useEffect, createContext, useRef } from 'react';
import { 
  Box, 
  Button, 
  Divider, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Typography,
  Paper,
  Avatar,
  TextField,
  InputAdornment,
  Badge,
  Menu,
  MenuItem,
  IconButton
} from '@mui/material';
import { 
  Inventory as InventoryIcon,
  ShoppingCart as OrdersIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Notifications as NotificationsIcon,
  Close as CloseIcon,
  BarChart as SalesIcon
} from '@mui/icons-material';
import { getAllOrders } from '../services/api';

// Create a context to share search functionality with child components
export const SearchContext = createContext();

export default function Management() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');
  
  // Notification system states
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastOrderCount, setLastOrderCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  // Use ref to track the last checked order count
  const lastOrderCountRef = useRef(lastOrderCount);
  
  // Update the ref whenever lastOrderCount changes
  useEffect(() => {
    lastOrderCountRef.current = lastOrderCount;
  }, [lastOrderCount]);

  // Determine if we're on the inventory or orders page
  const isInventoryPage = location.pathname.includes('/inventory');
  const isOrdersPage = location.pathname.includes('/orders');
  const isSalesPage = location.pathname.includes('/sales');
  
  // Reset search input when changing pages
  useEffect(() => {
    setSearchInput(searchParams.get('q') || '');
  }, [location.pathname, searchParams]);
  
  // Load notifications from localStorage
  useEffect(() => {
    const savedNotifications = localStorage.getItem('adminNotifications');
    if (savedNotifications) {
      const parsedNotifications = JSON.parse(savedNotifications);
      setNotifications(parsedNotifications);
      setUnreadCount(parsedNotifications.filter(n => !n.read).length);
    }
    
    const savedOrderCount = localStorage.getItem('lastOrderCount');
    if (savedOrderCount) {
      setLastOrderCount(parseInt(savedOrderCount));
    }
  }, []);
  
  // Save notifications to localStorage when they change
  useEffect(() => {
    localStorage.setItem('adminNotifications', JSON.stringify(notifications));
  }, [notifications]);
  
  // Save last order count to localStorage
  useEffect(() => {
    localStorage.setItem('lastOrderCount', lastOrderCount.toString());
  }, [lastOrderCount]);
  
  // Poll for new orders (admin only)
  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    
    const checkForNewOrders = async () => {
      try {
        const response = await getAllOrders();
        const currentOrders = response.data;
        const currentOrderCount = currentOrders.length;
        
        // Check if there are new orders
        if (lastOrderCountRef.current > 0 && currentOrderCount > lastOrderCountRef.current) {
          const newOrdersCount = currentOrderCount - lastOrderCountRef.current;
          
          // Find the new orders
          const newOrders = currentOrders
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, newOrdersCount);
            
          // Create notifications for new orders
          newOrders.forEach(order => {
            const newNotification = {
              id: `new-order-${order.id}-${Date.now()}`,
              title: 'New Order Received',
              message: `New order #${order.orderNumber} from ${order.deliveryDetails.fullName}`,
              time: new Date(),
              orderId: order.id,
              read: false
            };
            
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
          });
        }
        
        // Update the last order count
        setLastOrderCount(currentOrderCount);
      } catch (error) {
        console.error('Error checking for new orders:', error);
      }
    };
    
    // Check immediately on mount
    checkForNewOrders();
    
    // Set up polling every 30 seconds
    const intervalId = setInterval(checkForNewOrders, 30000);
    
    return () => clearInterval(intervalId);
    
  }, [user]);

  // Keep unread count in sync with notifications
  useEffect(() => {
    const unreadNotifications = notifications.filter(n => !n.read).length;
    setUnreadCount(unreadNotifications);
  }, [notifications]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateSearchParams('q', searchInput);
  };

  const updateSearchParams = (key, value) => {
    const newParams = new URLSearchParams(searchParams);

    if (value && value !== '') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }

    setSearchParams(newParams);
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };
  
  // Notification handlers
  const handleNotificationsMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  
  const markAllNotificationsAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };
  
  const handleDeleteNotification = (notificationId, event) => {
    event.stopPropagation();
    
    const notificationToDelete = notifications.find(n => n.id === notificationId);
    const wasUnread = notificationToDelete && !notificationToDelete.read;
    
    setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
    
    if (wasUnread) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };
  
  // Mark a specific notification as read
  const markNotificationAsRead = (notificationId) => {
    let wasUnread = false;
    
    // First check if notification is unread
    const notification = notifications.find(n => n.id === notificationId);
    wasUnread = notification && !notification.read;
    
    // Then update the notifications
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    );
    
    // Update the unread count if needed
    if (wasUnread) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };
  
  // Mark all notifications for a specific order as read
  const markOrderNotificationsAsRead = (orderId) => {
    let readCount = 0;
    
    setNotifications(prev => 
      prev.map(notification => {
        if (notification.orderId === orderId && !notification.read) {
          readCount++;
          return { ...notification, read: true };
        }
        return notification;
      })
    );
    
    if (readCount > 0) {
      setUnreadCount(prev => Math.max(0, prev - readCount));
    }
  };
  
  const handleViewOrder = (orderId) => {
    // Mark any notifications related to this order as read
    markOrderNotificationsAsRead(orderId);
    handleCloseMenu();
    navigate(`/${user.role}/order/${orderId}`);
  };
  
  // Check if we're on an order detail page and mark notifications as read
  useEffect(() => {
    if (!user) return;
    
    // Check if the current URL is an order detail page
    const orderIdMatch = location.pathname.match(/\/(?:admin|staff)\/order\/([a-zA-Z0-9]+)/);
    if (orderIdMatch && orderIdMatch[1]) {
      const orderId = orderIdMatch[1];
      markOrderNotificationsAsRead(orderId);
    }
  }, [location.pathname]);

  const drawerWidth = 240;

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: 'none',
            backgroundColor: '#f8f8f8'
          },
        }}
      >
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5" component="h1" fontWeight={600} gutterBottom>
            Merca Finds
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {user?.role || 'Staff'} Panel
          </Typography>
        </Box>

        <Divider />

        <List sx={{ flexGrow: 1 }}>
          <ListItem disablePadding>
            <ListItemButton 
              component={Link} 
              to={`/${user?.role}/inventory`}
              selected={isInventoryPage}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  borderRight: '2px solid #ff0000'
                },
                '&.Mui-selected:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.08)'
                }
              }}
            >
              <ListItemIcon>
                <InventoryIcon />
              </ListItemIcon>
              <ListItemText primary="Inventory" />
            </ListItemButton>
          </ListItem>

          {user && user.role === 'admin' && (
            <ListItem disablePadding>
              <ListItemButton 
                component={Link} 
                to="/admin/orders"
                selected={isOrdersPage}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    borderRight: '2px solid #ff0000'
                  },
                  '&.Mui-selected:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.08)'
                  }
                }}
              >
                <ListItemIcon>
                  <OrdersIcon />
                </ListItemIcon>
                <ListItemText primary="Orders" />
                {user.role === 'admin' && unreadCount > 0 && (
                  <Badge 
                    badgeContent={unreadCount > 0 ? unreadCount : null} 
                    color="error" 
                    sx={{ ml: 'auto' }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          )}

          {user && user.role === 'admin' && (
            <ListItem disablePadding>
              <ListItemButton 
                component={Link} 
                to="/admin/sales"
                selected={isSalesPage}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    borderRight: '2px solid #ff0000'
                  },
                  '&.Mui-selected:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.08)'
                  }
                }}
              >
                <ListItemIcon>
                  <SalesIcon />
                </ListItemIcon>
                <ListItemText primary="Sales" />
              </ListItemButton>
            </ListItem>
          )}
        </List>

        <Box sx={{ p: 2 }}>
          <Button
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            fullWidth
            variant="outlined"
            color="secondary"
            sx={{ 
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Log Out
          </Button>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: '#ffffff',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Common search header */}
        <Box
          sx={{
            p: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2
          }}
        >
          {/* Only show search form when NOT on the sales page */}
          {!isSalesPage ? (
            <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', gap: 2 }}>
              <TextField
                variant="outlined"
                size="small"
                placeholder={isInventoryPage ? "Looking for an item?" : "Search orders..."}
                value={searchInput}
                onChange={handleSearchInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: 300 }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                Search
              </Button>
              {searchParams.size > 0 && (
                <Button
                  onClick={handleClearFilters}
                  startIcon={<ClearIcon />}
                  color="secondary"
                >
                  Clear Filters
                </Button>
              )}
            </Box>
          ) : (
            /* Just render an empty div to maintain the flex layout */
            <div></div> 
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {user && user.role === 'admin' && (
              <Badge
                badgeContent={unreadCount > 0 ? unreadCount : null}
                color="error"
                overlap="circular"
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <IconButton
                  onClick={handleNotificationsMenu}
                  size="small"
                  aria-controls={open ? 'notifications-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                >
                  <NotificationsIcon />
                </IconButton>
              </Badge>
            )}
            
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="subtitle1" fontWeight={500}>
                {user?.fullName || user?.username || user?.role}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.role || 'Staff'}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Notifications Menu */}
        <Menu
          anchorEl={anchorEl}
          id="notifications-menu"
          open={open}
          onClose={handleCloseMenu}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
              mt: 1,
              width: 320,
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Button size="small" onClick={markAllNotificationsAsRead}>
                Mark all as read
              </Button>
            )}
          </Box>
          
          <Divider />
          
          {notifications.length === 0 ? (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No notifications
              </Typography>
            </Box>
          ) : (
            <>
              {notifications.map(notification => (
                <MenuItem 
                  key={notification.id}
                  onClick={() => {
                    markNotificationAsRead(notification.id);
                    handleViewOrder(notification.orderId);
                  }}
                  sx={{ 
                    py: 1.5,
                    px: 2,
                    borderLeft: notification.read ? 'none' : '4px solid',
                    borderColor: 'primary.main',
                    bgcolor: notification.read ? 'transparent' : 'action.hover',
                  }}
                >
                  <Box sx={{ width: '100%', position: 'relative', pr: 4 }}>
                    <Typography variant="body2" fontWeight={notification.read ? 400 : 600}>
                      {notification.title}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color="text.secondary" 
                      sx={{ 
                        display: 'block',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                        whiteSpace: 'normal'
                      }}
                    >
                      {notification.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                      {new Date(notification.time).toLocaleString()}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={(e) => handleDeleteNotification(notification.id, e)}
                      sx={{ position: 'absolute', top: 0, right: -8 }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </MenuItem>
              ))}
            </>
          )}
        </Menu>

        {/* Provide search context to child components */}
        <SearchContext.Provider value={{ 
          searchParams, 
          setSearchParams, 
          searchInput, 
          updateSearchParams
        }}>
          <Box sx={{ p: 3, flex: 1 }}>
            <Outlet />
          </Box>
        </SearchContext.Provider>
      </Box>
    </Box>
  );
}
