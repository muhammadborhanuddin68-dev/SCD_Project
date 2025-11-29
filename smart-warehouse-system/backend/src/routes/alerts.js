const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET all alerts
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT a.*, i.name as item_name, i.sku
       FROM alerts a
       JOIN items i ON a.item_id = i.id
       ORDER BY a.created_at DESC
       LIMIT 50`
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch alerts' });
    }
});

// PATCH mark alert as read
router.patch('/:id/read', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('UPDATE alerts SET is_read = true WHERE id = $1', [id]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update alert' });
    }
});

module.exports = router;
