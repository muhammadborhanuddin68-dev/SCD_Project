/**
 * FACTORY PATTERN - Supplier Creation
 * Problem: Different supplier types with different behaviors
 * Solution: Factory creates appropriate supplier subclass
 */

class Supplier {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.type = data.type;
        this.contact_email = data.contact_email;
        this.contact_phone = data.contact_phone;
        this.address = data.address;
    }

    getContactInfo() {
        return {
            name: this.name,
            email: this.contact_email,
            phone: this.contact_phone
        };
    }
}

class LocalSupplier extends Supplier {
    constructor(data) {
        super(data);
        this.deliveryTime = '1-2 days';
        this.shippingCost = 'low';
    }

    getContactInfo() {
        return {
            ...super.getContactInfo(),
            deliveryTime: this.deliveryTime,
            shippingCost: this.shippingCost,
            type: 'Local'
        };
    }
}

class InternationalSupplier extends Supplier {
    constructor(data) {
        super(data);
        this.deliveryTime = '7-14 days';
        this.shippingCost = 'high';
        this.customsClearance = true;
    }

    getContactInfo() {
        return {
            ...super.getContactInfo(),
            deliveryTime: this.deliveryTime,
            shippingCost: this.shippingCost,
            customsClearance: this.customsClearance,
            type: 'International'
        };
    }
}

class SupplierFactory {
    static createSupplier(type, data) {
        switch (type.toLowerCase()) {
            case 'local':
                return new LocalSupplier(data);
            case 'international':
                return new InternationalSupplier(data);
            default:
                return new Supplier(data);
        }
    }
}

module.exports = { SupplierFactory, Supplier };
