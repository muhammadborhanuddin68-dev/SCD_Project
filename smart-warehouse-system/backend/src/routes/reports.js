const express = require('express');
const router = express.Router();
const reportFacade = require('../facade/ReportFacade');

// GET inventory summary (using Facade)
router.get('/summary', async (req, res) => {
    try {
        const summary = await reportFacade.getInventorySummary();
        res.json(summary);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to generate summary' });
    }
});

// GET low stock report
router.get('/low-stock', async (req, res) => {
    try {
        const report = await reportFacade.getLowStockReport();
        res.json(report);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to generate low stock report' });
    }
});

// GET supplier performance
router.get('/suppliers', async (req, res) => {
    try {
        const report = await reportFacade.getSupplierPerformance();
        res.json(report);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to generate supplier report' });
    }
});

module.exports = router;
