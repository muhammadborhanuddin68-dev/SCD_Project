/**
 * FACTORY PATTERN - Item Creation
 * Problem: Avoid scattering 'new Item()' logic throughout codebase
 * Solution: Centralized factory creates different item types
 */

class Item {
    constructor(data) {
        this.id = data.id;
        this.sku = data.sku;
        this.name = data.name;
        this.type = data.type;
        this.quantity = data.quantity || 0;
        this.threshold = data.threshold || 10;
        this.warehouse_id = data.warehouse_id;
        this.zone = data.zone;
        this.rack = data.rack;
        this.bin = data.bin;
    }

    getDetails() {
        return {
            id: this.id,
            sku: this.sku,
            name: this.name,
            type: this.type,
            quantity: this.quantity,
            threshold: this.threshold,
            location: `${this.zone}-${this.rack}-${this.bin}`
        };
    }
}

class PerishableItem extends Item {
    constructor(data) {
        super(data);
        this.expiryDate = data.expiryDate;
    }

    getDetails() {
        return {
            ...super.getDetails(),
            expiryDate: this.expiryDate,
            perishable: true
        };
    }
}

class ElectronicItem extends Item {
    constructor(data) {
        super(data);
        this.warranty = data.warranty || '1 year';
    }

    getDetails() {
        return {
            ...super.getDetails(),
            warranty: this.warranty,
            category: 'electronics'
        };
    }
}

class BulkItem extends Item {
    constructor(data) {
        super(data);
        this.unitSize = data.unitSize || 'kg';
    }

    getDetails() {
        return {
            ...super.getDetails(),
            unitSize: this.unitSize,
            isBulk: true
        };
    }
}

class ItemFactory {
    static createItem(type, data) {
        switch (type.toLowerCase()) {
            case 'perishable':
                return new PerishableItem(data);
            case 'electronic':
                return new ElectronicItem(data);
            case 'bulk':
                return new BulkItem(data);
            default:
                return new Item(data);
        }
    }
}

module.exports = { ItemFactory, Item };
