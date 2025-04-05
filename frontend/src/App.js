import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout';
import ProductList from './components/ProductList';
import StockOverview from './components/StockOverview';
import Login from './components/Login';
import Register from './components/Register';
import ProductManagement from './components/ProductManagement';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/login" replace />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="stock" element={<StockOverview />} />
          <Route path="products" element={<ProductManagement />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
};

export default App; 