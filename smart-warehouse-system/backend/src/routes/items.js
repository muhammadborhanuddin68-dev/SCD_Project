const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { ItemFactory } = require('../factories/ItemFactory');
const { stockSubject } = require('../observer/StockObserver');
const { LabeledItemDecorator, QRCodeItemDecorator } = require('../decorator/ItemDecorator');

// GET all items (with decorator applied)
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM items ORDER BY created_at DESC');

        // Apply factory + decorator to each item
        const items = await Promise.all(result.rows.map(async (row) => {
            const item = ItemFactory.createItem(row.type, row);
            const labeledItem = new LabeledItemDecorator(item);
            await labeledItem.loadLabels();
            const qrItem = new QRCodeItemDecorator(labeledItem);
            return qrItem.getDetails();
        }));

        res.json(items);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch items' });
    }
});

// POST create new item (using Factory)
router.post('/', async (req, res) => {
    try {
        const { sku, name, type, quantity, threshold, warehouse_id, zone, rack, bin } = req.body;

        const result = await pool.query(
            `INSERT INTO items (sku, name, type, quantity, threshold, warehouse_id, zone, rack, bin)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [sku, name, type, quantity || 0, threshold || 10, warehouse_id, zone, rack, bin]
        );

        const item = ItemFactory.createItem(type, result.rows[0]);

        // Notify observers
        await stockSubject.notify(result.rows[0]);

        res.status(201).json(item.getDetails());
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create item' });
    }
});

// PATCH update stock (triggers Observer)
router.patch('/:id/stock', async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        const result = await pool.query(
            'UPDATE items SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
            [quantity, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }

        // Notify all observers about stock change
        await stockSubject.notify(result.rows[0]);

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update stock' });
    }
});

// POST add label to item (Decorator)
router.post('/:id/labels', async (req, res) => {
    try {
        const { id } = req.params;
        const { labelType, labelValue } = req.body;

        await pool.query(
            'INSERT INTO item_labels (item_id, label_type, label_value) VALUES ($1, $2, $3)',
            [id, labelType, labelValue]
        );

        res.json({ success: true, message: 'Label added' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add label' });
    }
});

module.exports = router;
