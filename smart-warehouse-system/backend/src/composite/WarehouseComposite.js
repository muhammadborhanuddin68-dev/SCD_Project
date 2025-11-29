/**
 * COMPOSITE PATTERN - Hierarchical Warehouse Structure
 * Problem: Represent warehouse → zone → rack → bin hierarchy
 * Solution: Treat individual bins and groups uniformly
 */

const pool = require('../config/database');

// Abstract Component
class WarehouseComponent {
    constructor(id, name, type) {
        this.id = id;
        this.name = name;
        this.type = type;
    }

    async getStock() {
        throw new Error('getStock() must be implemented by subclass');
    }

    async getCapacity() {
        throw new Error('getCapacity() must be implemented by subclass');
    }
}

// Composite (Warehouse, Zone, Rack)
class WarehouseComposite extends WarehouseComponent {
    constructor(id, name, type, capacity) {
        super(id, name, type);
        this.capacity = capacity;
        this.children = [];
    }

    async addChild(child) {
        this.children.push(child);
    }

    async removeChild(childId) {
        this.children = this.children.filter(c => c.id !== childId);
    }

    async getStock() {
        // Recursively get stock from all children
        let totalStock = 0;

        for (const child of this.children) {
            totalStock += await child.getStock();
        }

        return totalStock;
    }

    async getCapacity() {
        return this.capacity;
    }

    async loadChildren() {
        const result = await pool.query(
            'SELECT * FROM warehouses WHERE parent_id = $1',
            [this.id]
        );

        for (const row of result.rows) {
            let child;
            if (row.type === 'bin') {
                child = new Bin(row.id, row.name, row.capacity);
            } else {
                child = new WarehouseComposite(row.id, row.name, row.type, row.capacity);
                await child.loadChildren(); // Recursive load
            }
            this.children.push(child);
        }
    }
}

// Leaf (Bin)
class Bin extends WarehouseComponent {
    constructor(id, name, capacity) {
        super(id, name, 'bin');
        this.capacity = capacity;
    }

    async getStock() {
        // Get total quantity of items in this bin
        const result = await pool.query(
            'SELECT COALESCE(SUM(quantity), 0) as total FROM items WHERE bin = $1',
            [this.name]
        );
        return parseInt(result.rows[0].total);
    }

    async getCapacity() {
        return this.capacity;
    }
}

module.exports = { WarehouseComposite, Bin };
