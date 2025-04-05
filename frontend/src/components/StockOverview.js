import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    CircularProgress,
    Alert,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    TextField,
    Grid
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
}));

const StockOverview = () => {
    const navigate = useNavigate();
    const [stock, setStock] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [category, setCategory] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [sortOrder, setSortOrder] = useState('ASC');
    const [selectedFile, setSelectedFile] = useState(null);
    const [importStatus, setImportStatus] = useState(null);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        fetchStock();
        fetchCategories();
    }, [category, sortBy, sortOrder]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const fetchStock = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (category) params.append('category', category);
            if (sortBy) params.append('sortBy', sortBy);
            if (sortOrder) params.append('sortOrder', sortOrder);

            const response = await axiosInstance.get(`/stock?${params.toString()}`);
            setStock(response.data);
            setError(null);
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                setError(err.response?.data?.message || 'Error fetching stock data');
                console.error('Error fetching stock:', err);
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get('/products/categories');
            setCategories(response.data);
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    const handleExport = async () => {
        try {
            const response = await axiosInstance.get('/stock/export', {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'stock_export.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                setError(err.response?.data?.message || 'Error exporting stock data');
                console.error('Error exporting stock:', err);
            }
        }
    };

    const handleImport = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setSelectedFile(file);
        const formData = new FormData();
        formData.append('csv', file);

        try {
            setImportStatus('Importing...');
            await axiosInstance.post('/stock/import', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setImportStatus('Import successful!');
            fetchStock();
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                setImportStatus('Import failed');
                setError(err.response?.data?.message || 'Error importing stock data');
                console.error('Error importing stock:', err);
            }
        }
    };

    const handleDownloadTemplate = () => {
        window.open('http://localhost:5000/sample_stock.csv');
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Stock Overview
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {importStatus && (
                <Alert severity={importStatus.includes('success') ? 'success' : 'error'} sx={{ mb: 2 }}>
                    {importStatus}
                </Alert>
            )}

            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={category}
                            label="Category"
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <MenuItem value="">All Categories</MenuItem>
                            {categories.map((cat) => (
                                <MenuItem key={cat} value={cat}>
                                    {cat}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth>
                        <InputLabel>Sort By</InputLabel>
                        <Select
                            value={sortBy}
                            label="Sort By"
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <MenuItem value="">Default</MenuItem>
                            <MenuItem value="name">Name</MenuItem>
                            <MenuItem value="category">Category</MenuItem>
                            <MenuItem value="price">Price</MenuItem>
                            <MenuItem value="available_stock">Available Stock</MenuItem>
                            <MenuItem value="items_sold">Items Sold</MenuItem>
                            <MenuItem value="revenue">Revenue</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth>
                        <InputLabel>Sort Order</InputLabel>
                        <Select
                            value={sortOrder}
                            label="Sort Order"
                            onChange={(e) => setSortOrder(e.target.value)}
                        >
                            <MenuItem value="ASC">Ascending</MenuItem>
                            <MenuItem value="DESC">Descending</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleExport}
                            fullWidth
                        >
                            Export CSV
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            component="label"
                            fullWidth
                        >
                            Import CSV
                            <input
                                type="file"
                                hidden
                                accept=".csv"
                                onChange={handleImport}
                            />
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={handleDownloadTemplate}
                            fullWidth
                        >
                            Template
                        </Button>
                    </Box>
                </Grid>
            </Grid>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Available Stock</TableCell>
                            <TableCell>Items Sold</TableCell>
                            <TableCell>Revenue</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {stock.map((item) => (
                            <StyledTableRow key={item.id}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.category}</TableCell>
                                <TableCell>${typeof item.price === 'number' ? item.price.toFixed(2) : '0.00'}</TableCell>
                                <TableCell>{item.available_stock}</TableCell>
                                <TableCell>{item.items_sold}</TableCell>
                                <TableCell>${typeof item.revenue === 'number' ? item.revenue.toFixed(2) : '0.00'}</TableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default StockOverview; 