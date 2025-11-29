const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { SupplierFactory } = require('../factories/SupplierFactory');

// GET all suppliers
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM suppliers ORDER BY created_at DESC');

        const suppliers = result.rows.map(row => {
            const supplier = SupplierFactory.createSupplier(row.type, row);
            return supplier.getContactInfo();
        });

        res.json(suppliers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch suppliers' });
    }
});

// POST create supplier (using Factory)
router.post('/', async (req, res) => {
    try {
        const { name, type, contact_email, contact_phone, address } = req.body;

        const result = await pool.query(
            `INSERT INTO suppliers (name, type, contact_email, contact_phone, address)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [name, type, contact_email, contact_phone, address]
        );

        const supplier = SupplierFactory.createSupplier(type, result.rows[0]);
        res.status(201).json(supplier.getContactInfo());
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create supplier' });
    }
});

module.exports = router;
