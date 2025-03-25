import { Form, useActionData, useNavigation, Link } from 'react-router-dom';
import Header from '../Header'
import Footer from '../footer'

function Login() {
    const actionData = useActionData();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === 'submitting';

    return (
        <div className="login-container">
            <Header />
            <h1>Login</h1>

            <Form method="post">
                {actionData?.error && (
                    <div className="error-message">{actionData.error}</div>
                )}

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required
                    />
                </div>

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Logging in...' : 'Login'}
                </button>
            </Form>

            <div className="register-link">
                <p>Don't have an account? <Link to="/register">Register</Link></p>
            </div>

            <Footer />
        </div>
    );
}

export default Login;
