const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const csv = require('csv-parser');
const fs = require('fs');
const { createObjectCsvWriter } = require('csv-writer');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype !== 'text/csv') {
            return cb(new Error('Only CSV files are allowed'));
        }
        cb(null, true);
    }
});

// Get stock overview with filters and sorting
router.get('/', async (req, res) => {
    try {
        const { category, sortBy, sortOrder = 'ASC' } = req.query;
        
        let query = `
            SELECT 
                p.id,
                p.name,
                p.category,
                p.price,
                p.quantity as available_stock,
                COALESCE(SUM(t.quantity), 0) as items_sold,
                COALESCE(SUM(t.quantity * p.price), 0) as revenue
            FROM products p
            LEFT JOIN transactions t ON p.id = t.product_id
        `;

        const params = [];

        if (category) {
            query += ' WHERE p.category = ?';
            params.push(category);
        }

        query += ' GROUP BY p.id';

        if (sortBy) {
            const validSortColumns = ['name', 'category', 'price', 'available_stock', 'items_sold', 'revenue'];
            if (validSortColumns.includes(sortBy)) {
                query += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
            }
        }

        const [stock] = await pool.query(query, params);
        res.json(stock);
    } catch (error) {
        console.error('Error fetching stock:', error);
        res.status(500).json({ 
            message: 'Error fetching stock', 
            error: error.message,
            stack: error.stack 
        });
    }
});

// Export stock to CSV
router.get('/export', async (req, res) => {
    try {
        const [stock] = await pool.query(`
            SELECT 
                p.id,
                p.name,
                p.category,
                p.price,
                p.quantity as available_stock,
                COALESCE(SUM(t.quantity), 0) as items_sold,
                COALESCE(SUM(t.quantity * p.price), 0) as revenue
            FROM products p
            LEFT JOIN transactions t ON p.id = t.product_id
            GROUP BY p.id
        `);

        const csvWriter = createObjectCsvWriter({
            path: 'stock_export.csv',
            header: [
                { id: 'id', title: 'ID' },
                { id: 'name', title: 'Name' },
                { id: 'category', title: 'Category' },
                { id: 'price', title: 'Price' },
                { id: 'available_stock', title: 'Available Stock' },
                { id: 'items_sold', title: 'Items Sold' },
                { id: 'revenue', title: 'Revenue' }
            ]
        });

        await csvWriter.writeRecords(stock);

        res.download('stock_export.csv', 'stock_export.csv', (err) => {
            if (err) {
                console.error('Error downloading file:', err);
            }
            // Clean up the file after download
            fs.unlinkSync('stock_export.csv');
        });
    } catch (error) {
        console.error('Error exporting stock:', error);
        res.status(500).json({ 
            message: 'Error exporting stock', 
            error: error.message,
            stack: error.stack 
        });
    }
});

// Import stock from CSV
router.post('/import', upload.single('csv'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No CSV file uploaded' });
    }

    const results = [];

    try {
        // Parse CSV file
        await new Promise((resolve, reject) => {
            fs.createReadStream(req.file.path)
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', resolve)
                .on('error', reject);
        });

        // Process each row
        for (const row of results) {
            const { name, category, price, quantity } = row;
            
            // Check if product exists
            const [existingProducts] = await pool.query(
                'SELECT * FROM products WHERE name = ? AND category = ?',
                [name, category]
            );

            if (existingProducts.length > 0) {
                // Update existing product
                await pool.query(
                    'UPDATE products SET price = ?, quantity = ? WHERE id = ?',
                    [price, quantity, existingProducts[0].id]
                );
            } else {
                // Create new product
                await pool.query(
                    'INSERT INTO products (name, category, price, quantity) VALUES (?, ?, ?, ?)',
                    [name, category, price, quantity]
                );
            }
        }

        res.json({ message: 'Stock imported successfully' });
    } catch (error) {
        console.error('Error importing stock:', error);
        res.status(500).json({ 
            message: 'Error importing stock', 
            error: error.message,
            stack: error.stack 
        });
    } finally {
        // Clean up uploaded file
        if (req.file && req.file.path) {
            fs.unlinkSync(req.file.path);
        }
    }
});

// Record a sale
router.post('/sell', async (req, res) => {
    try {
        const { product_id, quantity } = req.body;
        
        // Start transaction
        const connection = await pool.getConnection();
        await connection.beginTransaction();
        
        try {
            // Update product quantity
            await connection.query(
                'UPDATE products SET quantity = quantity - ? WHERE id = ?',
                [quantity, product_id]
            );
            
            // Record transaction
            await connection.query(
                'INSERT INTO transactions (product_id, quantity, date) VALUES (?, ?, NOW())',
                [product_id, quantity]
            );
            
            await connection.commit();
            res.json({ message: 'Sale recorded successfully' });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error recording sale:', error);
        res.status(500).json({ 
            message: 'Error recording sale', 
            error: error.message,
            stack: error.stack 
        });
    }
});

module.exports = router; 