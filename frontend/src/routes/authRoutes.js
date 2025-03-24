import { redirect } from 'react-router-dom';
import { login as apiLogin, register as apiRegister } from '../services/api';

// Check if user is already logged in
export const loginLoader = async () => {
    const user = localStorage.getItem('user');
    if (user) {
        const userData = JSON.parse(user);
        return redirect(getRoleRedirect(userData.role));
    }
    return null;
};

// Handle login form submission
export const loginAction = async ({ request }) => {
    const formData = await request.formData();
    const email = formData.get('email');
    const password = formData.get('password');

    try {
        const response = await apiLogin(email, password);

        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify({
            id: response.data.user.id,
            email: response.data.user.email,
            fullName: response.data.user.fullName,
            role: response.data.user.role,
            token: response.data.token
        }));

        // Redirect based on user role
        return redirect(getRoleRedirect(response.data.user.role));
    } catch (error) {
        return { error: error.response?.data?.message || 'Login failed' };
    }
};

// Handle registration form submission
export const registerAction = async ({ request }) => {
    const formData = await request.formData();
    const userData = {
        email: formData.get('email'),
        password: formData.get('password'),
        fullName: formData.get('fullName'),
        contactNumber: formData.get('contactNumber'),
        address: {
            street: formData.get('street'),
            city: formData.get('city')
        }
    };

    try {
        const response = await apiRegister(userData);

        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify({
            id: response.data.user.id,
            email: response.data.user.email,
            fullName: response.data.user.fullName,
            role: response.data.user.role,
            token: response.data.token
        }));

        // Redirect to customer page (new users are always customers)
        return redirect('/customer');
    } catch (error) {
        return { error: error.response?.data?.message || 'Registration failed' };
    }
};

// Protect routes based on authentication
export const protectedLoader = () => {
    const user = localStorage.getItem('user');
    if (!user) {
        return redirect('/login');
    }
    return null;
};

// Helper function to redirect based on role
function getRoleRedirect(role) {
    switch (role) {
        case 'admin':
            return '/admin';
        case 'staff':
            return '/staff';
        case 'customer':
        default:
            return '/home';
    }
}
