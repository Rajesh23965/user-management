require('dotenv').config();
const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306
    });

    console.log('Database connection successful!');

    const [rows] = await connection.execute('SHOW TABLES');
    console.log('Current tables:', rows);

    await connection.end();
  } catch (error) {
    console.error('Database connection failed:', error.message);
  }
}

testConnection();
