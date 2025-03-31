import { Link, Outlet, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useState, useEffect, createContext } from 'react';
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
  InputAdornment
} from '@mui/material';
import { 
  Inventory as InventoryIcon,
  ShoppingCart as OrdersIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  Search as SearchIcon,
  Clear as ClearIcon
} from '@mui/icons-material';

// Create a context to share search functionality with child components
export const SearchContext = createContext();

export default function Management() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');

  // Determine if we're on the inventory or orders page
  const isInventoryPage = location.pathname.includes('/inventory');
  const isOrdersPage = location.pathname.includes('/orders');
  
  // Reset search input when changing pages
  useEffect(() => {
    setSearchInput(searchParams.get('q') || '');
  }, [location.pathname, searchParams]);

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

          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="subtitle1" fontWeight={500}>
              {user?.fullName || user?.username || user?.role}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.role || 'Staff'}
            </Typography>
          </Box>
        </Box>

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
