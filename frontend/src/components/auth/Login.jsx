import { useActionData, Form } from 'react-router-dom';
import { TextInput, PasswordInput, Button, Title, Text, Anchor, Group } from '@mantine/core';
import { Link } from 'react-router-dom';

function Login() {
    const actionData = useActionData(); // Get data returned by the action

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Header */}
            <header style={{ 
                padding: '20px', 
                borderBottom: '1px solid #e0e0e0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div className="logo" style={{ fontWeight: 'bold', fontSize: '20px' }}>Merca Finds</div>
                <nav style={{ display: 'flex', gap: '20px' }}>
                    <Anchor component={Link} to="/">Home</Anchor>
                    <Anchor component={Link} to="/orders">Orders</Anchor>
                    <Anchor component={Link} to="/chat">Chat</Anchor>
                    <Anchor component={Link} to="/signup">Sign Up</Anchor>
                </nav>
            </header>

            {/* Main Content */}
            <main style={{ 
                flex: '1',
                display: 'flex',
                padding: '40px 20px'
            }}>
                {/* Logo Section */}
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div>
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <img 
                                src="/logo.png" 
                                alt="MERC-A Logo" 
                                style={{ maxWidth: '250px' }}
                            />
                        </div>
                        <div style={{ 
                            fontSize: '24px', 
                            textAlign: 'center',
                            fontWeight: 'bold'
                        }}>MERCADORIA DE ARGILA</div>
                    </div>
                </div>

                {/* Login Form */}
                <div style={{ flex: 1, padding: '0 40px' }}>
                    <Title order={2} mb="md">Log in to your account</Title>
                    <Text mb="lg">Enter your details below</Text>

                    {/* Display error message if login fails */}
                    {actionData?.error && (
                        <div style={{ color: 'red', marginBottom: '16px' }}>
                            {actionData.error}
                        </div>
                    )}

                    {/* Use Form from react-router-dom */}
                    <Form method="post">
                        <TextInput
                            name="email"
                            label="Email or Phone Number"
                            placeholder="Enter your email or phone number"
                            required
                            mb="md"
                        />
                        <PasswordInput
                            name="password"
                            label="Password"
                            placeholder="Enter your password"
                            required
                            mb="lg"
                        />
                        <Button 
                            type="submit" 
                            fullWidth
                            style={{
                                backgroundColor: '#9b9b8c',
                                color: 'white',
                                height: '50px'
                            }}
                        >
                            Log In
                        </Button>
                    </Form>

                    <Group position="left" mt="md">
                        <Text size="sm">Don't have an account?</Text>
                        <Anchor component={Link} to="/register" size="sm">Sign Up</Anchor>
                    </Group>
                </div>
            </main>

            {/* Footer */}
            <footer style={{ 
                backgroundColor: '#000',
                color: 'white',
                padding: '40px 20px'
            }}>
                <div style={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    {/* Company Info */}
                    <div>
                        <div style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '10px' }}>Merca Finds</div>
                        <div style={{ marginBottom: '5px' }}>by Mercadoria de Argila</div>
                        <div style={{ maxWidth: '300px', fontSize: '14px' }}>
                            The ultimate one-stop platform for discovering a curated selection of pre-owned and brand-new items
                        </div>
                    </div>

                    {/* Support */}
                    <div>
                        <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>Support</div>
                        <div style={{ marginBottom: '5px' }}>Address</div>
                        <div style={{ marginBottom: '5px' }}>exclusive@gmail.com</div>
                        <div>+88000-88888-9999</div>
                    </div>

                    {/* Account */}
                    <div>
                        <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>Account</div>
                        <div style={{ marginBottom: '5px' }}>My Account</div>
                        <div style={{ marginBottom: '5px' }}>Login / Sign Up</div>
                        <div style={{ marginBottom: '5px' }}>Shopping Cart</div>
                        <div style={{ marginBottom: '5px' }}>Orders</div>
                        <div>Chat</div>
                    </div>

                    {/* Logo */}
                    <div>
                        <div style={{ 
                            border: '1px solid white',
                            padding: '20px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '150px',
                            height: '150px'
                        }}>
                            <div>
                                <img 
                                    src="/logo.png" 
                                    alt="MERC-A Logo" 
                                    style={{ maxWidth: '100px' }}
                                />
                                <div style={{ fontSize: '10px', textAlign: 'center' }}>MERCADORIA DE ARGILA</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ 
                    textAlign: 'center',
                    marginTop: '30px',
                    fontSize: '14px'
                }}>
                    © Copyright 2024. All right reserved
                </div>
            </footer>
        </div>
    );
}

export default Login;