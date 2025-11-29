/**
 * DECORATOR PATTERN - Item Labels
 * Problem: Need to attach extra info (labels/tags) without modifying Item class
 * Solution: Wrap items with decorators that add behavior
 */

const pool = require('../config/database');

// Base Decorator
class ItemDecorator {
    constructor(item) {
        this.item = item;
    }

    getDetails() {
        return this.item.getDetails();
    }
}

// Concrete Decorator: Labeled Item
class LabeledItemDecorator extends ItemDecorator {
    constructor(item, labels = []) {
        super(item);
        this.labels = labels;
    }

    async loadLabels() {
        const result = await pool.query(
            'SELECT label_type, label_value FROM item_labels WHERE item_id = $1',
            [this.item.id]
        );
        this.labels = result.rows;
    }

    getDetails() {
        return {
            ...this.item.getDetails(),
            labels: this.labels,
            isLabeled: true
        };
    }

    async addLabel(labelType, labelValue) {
        await pool.query(
            'INSERT INTO item_labels (item_id, label_type, label_value) VALUES ($1, $2, $3)',
            [this.item.id, labelType, labelValue]
        );
        this.labels.push({ label_type: labelType, label_value: labelValue });
    }
}

// Concrete Decorator: QR Code Item
class QRCodeItemDecorator extends ItemDecorator {
    constructor(item) {
        super(item);
        this.qrCode = this.generateQRData();
    }

    generateQRData() {
        // In real system, generate actual QR code
        return `QR-${this.item.sku}-${this.item.id}`;
    }

    getDetails() {
        return {
            ...this.item.getDetails(),
            qrCode: this.qrCode,
            qrEnabled: true
        };
    }
}

module.exports = { LabeledItemDecorator, QRCodeItemDecorator };
