-- Create your database
CREATE DATABASE warehouse_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE warehouse_management;

-- Items table
CREATE TABLE items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    quantity INT DEFAULT 0,
    threshold INT DEFAULT 10,
    warehouse_id INT,
    zone VARCHAR(100),
    rack VARCHAR(100),
    bin VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Suppliers table
CREATE TABLE suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Warehouses table (composite hierarchy)
CREATE TABLE warehouses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    parent_id INT,
    capacity INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES warehouses(id)
);

-- Alerts table
CREATE TABLE alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT,
    alert_type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES items(id)
);

-- Item labels table (decorator)
CREATE TABLE item_labels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT,
    label_type VARCHAR(50) NOT NULL,
    label_value VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES items(id)
);

-- Transactions table
CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT,
    type VARCHAR(50) NOT NULL,
    quantity INT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES items(id)
);

-- Insert sample warehouse hierarchy
INSERT INTO warehouses (name, type, parent_id, capacity) VALUES
('Main Warehouse', 'warehouse', NULL, 10000),
('Zone A', 'zone', 1, 5000),
('Zone B', 'zone', 1, 5000),
('Rack A1', 'rack', 2, 1000),
('Rack A2', 'rack', 2, 1000),
('Bin A1-1', 'bin', 4, 100),
('Bin A1-2', 'bin', 4, 100);



select * from items;