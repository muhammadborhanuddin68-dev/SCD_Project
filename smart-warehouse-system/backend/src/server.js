const express = require('express');
const cors = require('cors');
require('dotenv').config();

const itemsRoutes = require('./routes/items');
const suppliersRoutes = require('./routes/suppliers');
const warehousesRoutes = require('./routes/warehouses');
const alertsRoutes = require('./routes/alerts');
const reportsRoutes = require('./routes/reports');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/items', itemsRoutes);
app.use('/api/suppliers', suppliersRoutes);
app.use('/api/warehouses', warehousesRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/reports', reportsRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server running' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
