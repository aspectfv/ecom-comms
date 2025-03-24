import { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ItemDetail from './components/ItemDetail';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Main Components
import Home from './components/Home';

// Loaders and Actions
import { homeLoader } from './routes/homeRoutes';
import { itemDetailLoader } from './routes/itemRoutes';
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
        // You can add a loader here if needed
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
