import { Form, useActionData, useNavigation, Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Button,
    Card,
    Container,
    Divider,
    Link,
    TextField,
    Typography,
    Alert
} from '@mui/material';
import Header from '../Header';
import Footer from '../footer';

function Login() {
    const actionData = useActionData();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === 'submitting';

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />

            <Container maxWidth="sm" sx={{ py: 8, flex: 1 }}>
                <Card sx={{ p: 4 }}>
                    <Typography variant="h3" component="h1" gutterBottom>
                        Login
                    </Typography>

                    <Divider sx={{ my: 3 }} />

                    <Form method="post">
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {actionData?.error && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {actionData.error}
                                </Alert>
                            )}

                            <TextField
                                fullWidth
                                required
                                id="email"
                                name="email"
                                label="Email"
                                type="email"
                                variant="outlined"
                            />

                            <TextField
                                fullWidth
                                required
                                id="password"
                                name="password"
                                label="Password"
                                type="password"
                                variant="outlined"
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="large"
                                disabled={isSubmitting}
                                sx={{ mt: 2 }}
                            >
                                {isSubmitting ? 'Logging in...' : 'Login'}
                            </Button>
                        </Box>
                    </Form>

                    <Typography variant="body1" sx={{ mt: 3, textAlign: 'center' }}>
                        Don't have an account?{' '}
                        <Link
                            component={RouterLink}
                            to="/register"
                            color="secondary"
                            sx={{ fontWeight: 500 }}
                        >
                            Register
                        </Link>
                    </Typography>
                </Card>
            </Container>

            <Footer />
        </Box>
    );
}

export default Login;

