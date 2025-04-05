const mysql = require('mysql2/promise');
require('dotenv').config();

// Create initial connection without database
const initialConnection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root'
});

// Create connection pool with database
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: 'stock_management',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Function to setup database and tables
async function setupDatabase() {
    const connection = await initialConnection;
    try {
        // Create database
        await connection.query('CREATE DATABASE IF NOT EXISTS stock_management');
        console.log('Database created or already exists');

        // Use the database
        await connection.query('USE stock_management');

        // Create users table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                email VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Users table created or already exists');

        // Create products table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                category VARCHAR(100) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                quantity INT NOT NULL DEFAULT 0,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('Products table created or already exists');

        // Create transactions table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS transactions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                product_id INT NOT NULL,
                quantity INT NOT NULL,
                date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            )
        `);
        console.log('Transactions table created or already exists');

        return true;
    } catch (error) {
        console.error('Error setting up database:', error);
        return false;
    } finally {
        await connection.end();
    }
}

// Function to test database connection
async function testConnection() {
    try {
        // Setup database and tables
        const setupSuccess = await setupDatabase();
        if (!setupSuccess) {
            return false;
        }

        // Test the pool connection
        const [rows] = await pool.query('SELECT 1');
        console.log('Database connection successful');
        return true;
    } catch (error) {
        console.error('Error connecting to the database:', error);
        return false;
    }
}

module.exports = { pool, testConnection }; 