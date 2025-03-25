import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#000000',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#ff0000',
            light: '#ffff00',
        },
        background: {
            default: '#ffffff',
            paper: '#f8f8f8',
        },
        text: {
            primary: '#000000',
            secondary: '#555555',
        },
    },
    typography: {
        fontFamily: 'Inter, sans-serif',
        h1: {
            fontSize: '2.5rem',
            fontWeight: 600,
            letterSpacing: '-0.5px',
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 500,
            letterSpacing: '-0.25px',
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 500,
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.6,
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.5,
        },
    },
    spacing: 8, // Base spacing unit (8px)
    shape: {
        borderRadius: 8, // Subtle rounded corners
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    fontFamily: 'Inter, sans-serif',
                    lineHeight: 1.5,
                    backgroundColor: '#ffffff',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none', // Disable uppercase transformation
                    padding: '8px 16px',
                    fontWeight: 500,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    transition: 'box-shadow 0.2s ease',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    },
                },
            },
        },
        MuiContainer: {
            styleOverrides: {
                root: {
                    padding: '24px',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: '#ffffff',
                    padding: '24px',
                    marginBottom: '24px',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                },
            },
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    color: '#000000',
                    textDecoration: 'none',
                    '&:hover': {
                        color: '#ff0000',
                        textDecoration: 'underline',
                    },
                },
            },
        },
    },
});

export default theme;

