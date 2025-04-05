import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    Button,
    Container
} from '@mui/material';

const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isAuthenticated = localStorage.getItem('token');

    useEffect(() => {
        // If not authenticated and not on login/register pages, redirect to login
        if (!isAuthenticated && !['/login', '/register'].includes(location.pathname)) {
            navigate('/login');
        }
    }, [isAuthenticated, location.pathname, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Stock Management
                    </Typography>
                    {isAuthenticated ? (
                        <>
                            <Button color="inherit" onClick={() => navigate('/products')}>
                                Products
                            </Button>
                            <Button color="inherit" onClick={() => navigate('/stock')}>
                                Stock
                            </Button>
                            <Button color="inherit" onClick={handleLogout}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button color="inherit" onClick={() => navigate('/login')}>
                                Login
                            </Button>
                            <Button color="inherit" onClick={() => navigate('/register')}>
                                Register
                            </Button>
                        </>
                    )}
                </Toolbar>
            </AppBar>
            <Container sx={{ mt: 4 }}>
                <Outlet />
            </Container>
        </Box>
    );
};

export default Layout; 