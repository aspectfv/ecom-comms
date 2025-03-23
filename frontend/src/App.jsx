import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';

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
// import {
//     loginAction,
//     loginLoader,
//     registerAction,
//     registerLoader,
//     logoutAction,
//     protectedLoader
// } from './routes/authRoutes';

const router = createBrowserRouter([
    {
        path: '/home',
        element: <Home />,
        // action: loginAction,
        // loader: loginLoader,
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
        // loader: protectedLoader,
    },
    {
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
        <MantineProvider withGlobalStyles withNormalizeCSS>
            <RouterProvider router={router} />
        </MantineProvider>
    );
}

export default App;
