import { Link, Outlet, useNavigate } from 'react-router-dom';
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
  Avatar
} from '@mui/material';
import { 
  Inventory as InventoryIcon,
  ShoppingCart as OrdersIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon 
} from '@mui/icons-material';

export default function Management() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
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
          p: 3,
          backgroundColor: '#ffffff',
          minHeight: '100vh'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
