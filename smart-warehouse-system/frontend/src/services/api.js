import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Items API
export const itemsAPI = {
    getAll: () => api.get('/items'),
    create: (data) => api.post('/items', data),
    updateStock: (id, quantity) => api.patch(`/items/${id}/stock`, { quantity }),
    addLabel: (id, labelType, labelValue) =>
        api.post(`/items/${id}/labels`, { labelType, labelValue }),
};

// Suppliers API
export const suppliersAPI = {
    getAll: () => api.get('/suppliers'),
    create: (data) => api.post('/suppliers', data),
};

// Warehouses API
export const warehousesAPI = {
    getAll: () => api.get('/warehouses'),
    getStock: (id) => api.get(`/warehouses/${id}/stock`),
};

// Alerts API
export const alertsAPI = {
    getAll: () => api.get('/alerts'),
    markAsRead: (id) => api.patch(`/alerts/${id}/read`),
};

// Reports API (Facade)
export const reportsAPI = {
    getSummary: () => api.get('/reports/summary'),
    getLowStock: () => api.get('/reports/low-stock'),
    getSupplierPerformance: () => api.get('/reports/suppliers'),
};

export default api;
