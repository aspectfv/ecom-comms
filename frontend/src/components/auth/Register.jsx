import { useActionData, Form } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
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

function Register() {
    const actionData = useActionData();

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />

            <Container maxWidth="sm" sx={{ py: 8, flex: 1 }}>
                <Card sx={{ p: 4 }}>
                    <Typography variant="h3" component="h2" gutterBottom>
                        Create an account
                    </Typography>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                        Enter your details below
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
                                id="fullName"
                                name="fullName"
                                label="Full Name"
                                type="text"
                                variant="outlined"
                            />

                            <TextField
                                fullWidth
                                required
                                id="email"
                                name="email"
                                label="Email or Phone Number"
                                type="text"
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
                                fullWidth
                                sx={{ mt: 2 }}
                            >
                                Create Account
                            </Button>
                        </Box>
                    </Form>

                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Typography variant="body1" component="span" sx={{ mr: 1 }}>
                            Already have an account?
                        </Typography>
                        <Link
                            component={RouterLink}
                            to="/login"
                            color="secondary"
                            sx={{ fontWeight: 500 }}
                        >
                            Log In
                        </Link>
                    </Box>
                </Card>
            </Container>

            <Footer />
        </Box>
    );
}

export default Register;

