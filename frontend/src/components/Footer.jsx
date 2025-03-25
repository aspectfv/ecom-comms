import {
    Box,
    Typography,
    Divider,
    Button,
    Grid,
    Container
} from '@mui/material';
import { Facebook, Twitter, Instagram } from '@mui/icons-material';

export default function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: 'background.paper',
                py: 6,
                mt: 'auto'
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    {/* About Section */}
                    <Grid item xs={12} md={3}>
                        <Typography variant="h5" gutterBottom>
                            Merca Finds
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            by Mercadoria de Argila
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            The ultimate one-stop platform for discovering a curated selection of pre-owned and brand-new items
                        </Typography>
                        <Box
                            component="img"
                            src="https://placehold.co/100x50?text=Logo"
                            alt="Merca Finds Logo"
                            width={100}
                            sx={{ mt: 2 }}
                        />
                    </Grid>

                    {/* Support Section */}
                    <Grid item xs={12} md={3}>
                        <Typography variant="h6" gutterBottom>
                            Support
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            123 Market Street
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            San Francisco, CA 94103
                        </Typography>
                    </Grid>

                    {/* Contact Section */}
                    <Grid item xs={12} md={3}>
                        <Typography variant="h6" gutterBottom>
                            Contact
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            exclusive@gmail.com
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            +1 (555) 123-4567
                        </Typography>
                    </Grid>

                    {/* Social Section */}
                    <Grid item xs={12} md={3}>
                        <Typography variant="h6" gutterBottom>
                            Follow Us
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                variant="outlined"
                                size="small"
                                sx={{
                                    minWidth: 0,
                                    p: 1,
                                    borderColor: 'divider',
                                    color: 'text.secondary'
                                }}
                            >
                                <Instagram fontSize="small" />
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                sx={{
                                    minWidth: 0,
                                    p: 1,
                                    borderColor: 'divider',
                                    color: 'text.secondary'
                                }}
                            >
                                <Twitter fontSize="small" />
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                sx={{
                                    minWidth: 0,
                                    p: 1,
                                    borderColor: 'divider',
                                    color: 'text.secondary'
                                }}
                            >
                                <Facebook fontSize="small" />
                            </Button>
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                >
                    © 2025 Merca Finds. All rights reserved.
                </Typography>
            </Container>
        </Box>
    );
}

