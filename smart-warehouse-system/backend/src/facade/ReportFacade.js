/**
 * FACADE PATTERN - Unified Reporting Interface
 * Problem: Complex reporting requires data from multiple services
 * Solution: Single facade hides complexity
 */

const pool = require('../config/database');

class ReportFacade {
    // Unified method: Get complete inventory summary
    async getInventorySummary() {
        const totalItems = await this._getTotalItems();
        const lowStockItems = await this._getLowStockCount();
        const totalSuppliers = await this._getTotalSuppliers();
        const recentAlerts = await this._getRecentAlerts();
        const warehouseUtilization = await this._getWarehouseUtilization();

        return {
            summary: {
                totalItems,
                lowStockItems,
                totalSuppliers,
                alertCount: recentAlerts.length
            },
            alerts: recentAlerts,
            utilization: warehouseUtilization
        };
    }

    // Unified method: Low stock report
    async getLowStockReport() {
        const result = await pool.query(
            `SELECT id, sku, name, quantity, threshold,
              (threshold - quantity) as deficit
       FROM items
       WHERE quantity <= threshold
       ORDER BY (threshold - quantity) DESC`
        );
        return result.rows;
    }

    // Unified method: Supplier performance
    async getSupplierPerformance() {
        // Simplified: count items per supplier (in real system, track orders)
        const result = await pool.query(
            `SELECT s.id, s.name, s.type, COUNT(i.id) as item_count
       FROM suppliers s
       LEFT JOIN items i ON i.warehouse_id = s.id
       GROUP BY s.id, s.name, s.type
       ORDER BY item_count DESC`
        );
        return result.rows;
    }

    // Private helper methods
    async _getTotalItems() {
        const result = await pool.query('SELECT COUNT(*) as count FROM items');
        return parseInt(result.rows[0].count);
    }

    async _getLowStockCount() {
        const result = await pool.query(
            'SELECT COUNT(*) as count FROM items WHERE quantity <= threshold'
        );
        return parseInt(result.rows[0].count);
    }

    async _getTotalSuppliers() {
        const result = await pool.query('SELECT COUNT(*) as count FROM suppliers');
        return parseInt(result.rows[0].count);
    }

    async _getRecentAlerts() {
        const result = await pool.query(
            `SELECT a.*, i.name as item_name, i.sku
       FROM alerts a
       JOIN items i ON a.item_id = i.id
       WHERE a.is_read = false
       ORDER BY a.created_at DESC
       LIMIT 10`
        );
        return result.rows;
    }

    async _getWarehouseUtilization() {
        const result = await pool.query(
            `SELECT
        COALESCE(SUM(quantity), 0) as total_stock,
        (SELECT SUM(capacity) FROM warehouses WHERE type = 'warehouse') as total_capacity
       FROM items`
        );
        const row = result.rows[0];
        const utilizationPercent = (row.total_stock / row.total_capacity) * 100;
        return {
            currentStock: parseInt(row.total_stock),
            totalCapacity: parseInt(row.total_capacity),
            utilizationPercent: utilizationPercent.toFixed(2)
        };
    }
}

module.exports = new ReportFacade();
