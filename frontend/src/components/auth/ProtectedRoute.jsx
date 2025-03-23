// src/components/auth/ProtectedRoute.jsx
import { Navigate, useLoaderData } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
    const userData = localStorage.getItem('user');

    if (!userData) {
        return <Navigate to="/login" replace />;
    }

    const user = JSON.parse(userData);

    // Check if user has the required role
    if (requiredRole && user.role !== requiredRole) {
        // Redirect to appropriate page based on user's role
        switch (user.role) {
            case 'admin':
                return <Navigate to="/admin" replace />;
            case 'staff':
                return <Navigate to="/staff" replace />;
            case 'customer':
                return <Navigate to="/customer" replace />;
            default:
                return <Navigate to="/login" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
