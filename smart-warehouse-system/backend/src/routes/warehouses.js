const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { WarehouseComposite } = require('../composite/WarehouseComposite');

// GET warehouse stock (using Composite pattern)
router.get('/:id/stock', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query('SELECT * FROM warehouses WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Warehouse not found' });
        }

        const warehouseData = result.rows[0];
        const warehouse = new WarehouseComposite(
            warehouseData.id,
            warehouseData.name,
            warehouseData.type,
            warehouseData.capacity
        );

        await warehouse.loadChildren();
        const totalStock = await warehouse.getStock();
        const capacity = await warehouse.getCapacity();

        res.json({
            warehouse: warehouseData.name,
            totalStock,
            capacity,
            utilization: ((totalStock / capacity) * 100).toFixed(2) + '%'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to get warehouse stock' });
    }
});

// GET all warehouses
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM warehouses ORDER BY type, name');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch warehouses' });
    }
});

module.exports = router;
