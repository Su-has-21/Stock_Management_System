const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// Get all products
router.get('/', async (req, res) => {
    try {
        const [products] = await pool.query('SELECT * FROM products');
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error fetching products' });
    }
});

// Get unique categories
router.get('/categories', async (req, res) => {
    try {
        const [categories] = await pool.query('SELECT DISTINCT category FROM products ORDER BY category');
        res.json(categories.map(cat => cat.category));
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Error fetching categories' });
    }
});

// Get a single product
router.get('/:id', async (req, res) => {
    try {
        const [products] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
        if (products.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(products[0]);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Error fetching product' });
    }
});

// Create a new product
router.post('/', async (req, res) => {
    try {
        const { name, category, price, quantity, description } = req.body;
        const [result] = await pool.query(
            'INSERT INTO products (name, category, price, quantity, description) VALUES (?, ?, ?, ?, ?)',
            [name, category, price, quantity, description]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Error creating product' });
    }
});

// Update a product
router.put('/:id', async (req, res) => {
    try {
        const { name, category, price, quantity, description } = req.body;
        const [result] = await pool.query(
            'UPDATE products SET name = ?, category = ?, price = ?, quantity = ?, description = ? WHERE id = ?',
            [name, category, price, quantity, description, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ id: req.params.id, ...req.body });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Error updating product' });
    }
});

// Delete a product
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Error deleting product' });
    }
});

module.exports = router; 