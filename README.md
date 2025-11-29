# Smart Inventory & Warehouse Management System

A full-stack web application demonstrating software design patterns (Factory, Composite, Observer, Decorator, Facade) for warehouse inventory management.

##  Design Patterns Implemented

### 1. Factory Pattern
- **Location**: `backend/src/factories/`
- **Problem**: Avoid scattering object creation logic
- **Implementation**: ItemFactory and SupplierFactory create different item/supplier types

### 2. Composite Pattern
- **Location**: `backend/src/composite/`
- **Problem**: Represent hierarchical warehouse structure (Warehouse → Zone → Rack → Bin)
- **Implementation**: WarehouseComposite treats individual bins and groups uniformly

### 3. Observer Pattern
- **Location**: `backend/src/observer/`
- **Problem**: Notify multiple systems when stock changes
- **Implementation**: StockSubject notifies LowStockAlert, CriticalStockAlert, DashboardNotifier observers

### 4. Decorator Pattern
- **Location**: `backend/src/decorator/`
- **Problem**: Attach labels/QR codes without modifying Item class
- **Implementation**: LabeledItemDecorator and QRCodeItemDecorator wrap items

### 5. Facade Pattern
- **Location**: `backend/src/facade/`
- **Problem**: Simplify complex reporting operations
- **Implementation**: ReportFacade unifies inventory, supplier, and alert data access

##  Tech Stack

- **Frontend**: React, Material-UI, Axios, React Router
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Language**: JavaScript (ES6+)

##  Installation

### Prerequisites
- Node.js (v14+)
- PostgreSQL (v12+)

### Database Setup
psql -U postgres
CREATE DATABASE warehouse_management;
\c warehouse_management

Run schema from backend/database/schema.sql

### Backend Setup
cd backend
npm install

Configure .env file
npm run dev

### Frontend Setup
cd frontend
npm install
npm start


##  Usage

1. Access dashboard at `http://localhost:3000`
2. Add items via Inventory page (Factory pattern)
3. Create suppliers via Suppliers page
4. Update stock → triggers Observer alerts
5. View reports via Reports page (Facade pattern)

##  Folder Structure

smart-warehouse-system/
├── backend/
│ ├── src/
│ │ ├── factories/ # Factory Pattern
│ │ ├── composite/ # Composite Pattern
│ │ ├── observer/ # Observer Pattern
│ │ ├── decorator/ # Decorator Pattern
│ │ ├── facade/ # Facade Pattern
│ │ └── routes/ # API endpoints
│ └── database/
└── frontend/
└── src/
└── components/ # React UI components

##  Author

Muhammad Borhan uddin - BSSE - BUITEMS
