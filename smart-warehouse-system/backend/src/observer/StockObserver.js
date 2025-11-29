/**
 * OBSERVER PATTERN - Stock Alert System
 * Problem: Multiple parts need to know when stock changes
 * Solution: Subject notifies all registered observers
 */

const pool = require('../config/database');

// Observer Interface
class StockObserver {
    async update(item) {
        throw new Error('update() must be implemented');
    }
}

// Concrete Observer 1: Low Stock Alert
class LowStockAlertObserver extends StockObserver {
    async update(item) {
        if (item.quantity <= item.threshold && item.quantity > 0) {
            await pool.query(
                `INSERT INTO alerts (item_id, alert_type, message)
         VALUES ($1, $2, $3)`,
                [
                    item.id,
                    'low_stock',
                    `Low stock alert: ${item.name} (SKU: ${item.sku}) has only ${item.quantity} units left. Threshold: ${item.threshold}`
                ]
            );
            console.log(`🟡 LOW STOCK ALERT: ${item.name} - ${item.quantity} units`);
        }
    }
}

// Concrete Observer 2: Critical Stock Alert
class CriticalStockObserver extends StockObserver {
    async update(item) {
        if (item.quantity === 0) {
            await pool.query(
                `INSERT INTO alerts (item_id, alert_type, message)
         VALUES ($1, $2, $3)`,
                [
                    item.id,
                    'out_of_stock',
                    `CRITICAL: ${item.name} (SKU: ${item.sku}) is OUT OF STOCK!`
                ]
            );
            console.log(`🔴 OUT OF STOCK: ${item.name}`);
        }
    }
}

// Concrete Observer 3: Dashboard Notifier (simulated)
class DashboardNotifierObserver extends StockObserver {
    async update(item) {
        // In real system, this would push to WebSocket or similar
        console.log(`📊 Dashboard Update: ${item.name} quantity changed to ${item.quantity}`);
    }
}

// Subject
class StockSubject {
    constructor() {
        this.observers = [];
    }

    attach(observer) {
        this.observers.push(observer);
        console.log(`✅ Observer attached: ${observer.constructor.name}`);
    }

    detach(observer) {
        const index = this.observers.indexOf(observer);
        if (index > -1) {
            this.observers.splice(index, 1);
        }
    }

    async notify(item) {
        console.log(`📢 Notifying ${this.observers.length} observers about ${item.name}`);
        for (const observer of this.observers) {
            await observer.update(item);
        }
    }
}

// Singleton instance
const stockSubject = new StockSubject();
stockSubject.attach(new LowStockAlertObserver());
stockSubject.attach(new CriticalStockObserver());
stockSubject.attach(new DashboardNotifierObserver());

module.exports = { stockSubject, StockObserver };
