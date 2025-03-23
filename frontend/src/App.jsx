import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Main Components
import Home from './components/Home';
import CustomerHome from './components/customer/CustomerHome';
import StaffHome from './components/staff/StaffHome';
import AdminHome from './components/admin/AdminHome';

// Loaders and Actions
import { homeLoader } from './routes/homeRoutes';

const router = createBrowserRouter([
    {
        path: '/home',
        element: <Home />,
        loader: homeLoader,
    },
    {
        path: '/login',
        element: <Login />,
        // action: loginAction,
        // loader: loginLoader,
    },
    {
        path: '/register',
        element: <Register />,
        // action: registerAction,
        // loader: registerLoader,
    },
    {
        path: '/customer',
        element: (
            <ProtectedRoute requiredRole="customer">
                <CustomerHome />
            </ProtectedRoute>
        ),
        // loader: protectedLoader, }, {
        path: '/staff',
        element: (
            <ProtectedRoute requiredRole="staff">
                <StaffHome />
            </ProtectedRoute>
        ),
        // loader: protectedLoader,
    },
    {
        path: '/admin',
        element: (
            <ProtectedRoute requiredRole="admin">
                <AdminHome />
            </ProtectedRoute>
        ),
        // loader: protectedLoader,
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
