const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDatabase() {
    // Create connection without specifying database
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'root'
    });

    try {
        // Create database
        await connection.query('CREATE DATABASE IF NOT EXISTS stock_management');
        console.log('Database created or already exists');

        // Use the database
        await connection.query('USE stock_management');

        // Drop existing foreign key constraint if it exists
        await connection.query(`
            ALTER TABLE transactions 
            DROP FOREIGN KEY IF EXISTS transactions_ibfk_1
        `);
        console.log('Existing foreign key constraint dropped');

        // Create products table if it doesn't exist
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

        // Create transactions table if it doesn't exist
        await connection.query(`
            CREATE TABLE IF NOT EXISTS transactions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                product_id INT NOT NULL,
                quantity INT NOT NULL,
                date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Transactions table created or already exists');

        // Add foreign key constraint with ON DELETE CASCADE
        await connection.query(`
            ALTER TABLE transactions
            ADD CONSTRAINT transactions_ibfk_1
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        `);
        console.log('Foreign key constraint added with ON DELETE CASCADE');

        console.log('Database setup completed successfully');
    } catch (error) {
        console.error('Error setting up database:', error);
        throw error;
    } finally {
        await connection.end();
    }
}

setupDatabase(); 