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

// Loaders and Actions
import { homeLoader } from './routes/homeRoutes';
import { cartLoader } from './routes/cartRoutes';
import { ordersLoader } from './routes/ordersRoutes';
import { checkoutAction, checkoutLoader } from './routes/checkoutRoutes';
import { itemDetailLoader, itemDetailAction } from './routes/itemRoutes';
import { loginLoader, loginAction, registerAction } from './routes/authRoutes';

const router = createBrowserRouter([
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
        path: '/logout',
        // action: logoutAction,
    },
    {
        path: '/',
        element: <Navigate to="/home" replace />,
    },
    {
        path: '*',
        element: <Navigate to="/" replace />,
    },
]);

function App() {
    return (
        <RouterProvider router={router} />
    );
}

export default App;
