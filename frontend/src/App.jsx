import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Main Components
import Home from './components/Home';
import Cart from './components/Cart';
import ItemDetail from './components/ItemDetail';
import Checkout from './components/Checkout';
import Orders from './components/Orders';
import Management from './components/Management';
import Inventory from './components/Inventory';
import Sales from './components/Sales';
import AddNewListing from './components/AddNewListing';
import ViewDetails from './components/ViewDetails';
import AdminOrders from './components/AdminOrders';

// Loaders and Actions
import { homeLoader } from './routes/homeRoutes';
import { cartLoader } from './routes/cartRoutes';
import { ordersLoader } from './routes/ordersRoutes';
import { checkoutAction, checkoutLoader } from './routes/checkoutRoutes';
import { itemDetailLoader, itemDetailAction } from './routes/itemRoutes';
import { loginLoader, loginAction, registerAction } from './routes/authRoutes';
import { inventoryLoader } from './routes/inventoryRoutes';
import { adminOrdersLoader } from './routes/adminOrdersRoutes';
import { addNewListingAction } from './routes/addNewListingRoutes';
import { viewDetailsLoader, viewDetailsAction } from './routes/viewDetailsRoutes';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/home" replace />,
    },
    {
        path: '/home',
        element: <Home />,
        loader: homeLoader,
    },
    {
        path: '/item/:id',
        element: <ItemDetail />,
        loader: itemDetailLoader,
        action: itemDetailAction,
    },
    {
        path: '/cart',
        element: (
            <Cart />
        ),
        loader: cartLoader,
    },
    {
        path: '/checkout',
        element: (
            <Checkout />
        ),
        loader: checkoutLoader,
        action: checkoutAction,
    },
    {
        path: '/orders',
        element: (
            <Orders />
        ),
        loader: ordersLoader,
    },
    {
        path: '/login',
        element: <Login />,
        action: loginAction,
        loader: loginLoader,
    },
    {
        path: '/register',
        element: <Register />,
        action: registerAction,
        // loader: registerLoader,
    },
    {
        path: '/admin',
        element: (
            <ProtectedRoute requiredRole="admin">
                <Management />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true, // Default child route
                element: <Navigate to="/admin/inventory" replace />, // Redirect to /admin/inventory
            },
            {
                path: 'inventory', // Add this explicit route
                element: <Inventory />,
                loader: inventoryLoader,
            },
            {
                path: 'orders', // Add this explicit route
                element: <AdminOrders />,
                loader: adminOrdersLoader,
            },
            {
                path: 'add-new-listing',
                element: <AddNewListing />,
                action: addNewListingAction,
            },
            {
                path: 'order/:id',
                element: <ViewDetails />,
                loader: viewDetailsLoader,
                action: viewDetailsAction,
            },
        ],
    },
    {
        path: '/staff',
        element: (
            <ProtectedRoute requiredRole="staff">
                <Management />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <Navigate to="/staff/inventory" replace />,
            },
            {
                path: 'inventory',
                element: <Inventory />,
                loader: inventoryLoader,
            },
            {
                path: 'add-new-listing',
                element: <AddNewListing />,
                action: addNewListingAction,
            },
            {
                path: 'item/:id',
                element: <ViewDetails />,
                loader: viewDetailsLoader,
            },
        ],
    },
]);

function App() {
    return (
        <RouterProvider router={router} />
    );
}

export default App;
