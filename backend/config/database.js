// const mysql = require('mysql2/promise');
// require('dotenv').config();

// // Create connection pool
// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   waitForConnections: true,
//   connectionLimit: 10,
//   maxIdle: 10,
//   idleTimeout: 60000,
//   queueLimit: 0
// });

// // Test connection
// pool.getConnection()
//   .then(connection => {
//     console.log('MySQL Database connected successfully');
//     connection.release();
//   })
//   .catch(err => {
//     console.error('Database connection failed:', err.message);
//   });

// module.exports = pool;





const mysql = require('mysql2/promise');
require('dotenv').config();

let pool;

// Try connection string first, fall back to individual variables
if (process.env.DATABASE_URL) {
  console.log('Using DATABASE_URL connection string');
  pool = mysql.createPool(process.env.DATABASE_URL);
} else {
  console.log('Using individual database credentials');
  console.log('Host:', process.env.DB_HOST);
  console.log('Port:', process.env.DB_PORT || 3306);
  console.log('Database:', process.env.DB_NAME);
  
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 60000
  });
}

// Test connection
pool.getConnection()
  .then(connection => {
    console.log('SUCCESS: MySQL Database connected successfully');
    console.log('Connection established to:', process.env.DB_HOST || 'database');
    connection.release();
  })
  .catch(err => {
    console.error('FAILED: Database connection failed');
    console.error('Error:', err.message);
    console.error('Error Code:', err.code);
    console.error('Host:', process.env.DB_HOST);
    console.error('Port:', process.env.DB_PORT);
  });

module.exports = pool;
