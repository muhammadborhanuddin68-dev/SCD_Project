const pool = require('./config/database');

async function testConnection() {
    try {
        const result = await pool.query('SELECT 1 AS test');
        console.log('Connected! Result:', result.rows);
    } catch (err) {
        console.error('Connection error:', err);
    }
}

testConnection();
