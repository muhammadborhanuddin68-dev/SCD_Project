import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { Warehouse as WarehouseIcon } from '@mui/icons-material';
import Dashboard from './components/Dashboard';
import InventoryList from './components/InventoryList';
import SupplierPanel from './components/SupplierPanel';
import AlertsPanel from './components/AlertsPanel';
import ReportsView from './components/ReportsView';

import './App.css';

// A custom NavButton component to handle the active state
const NavButton = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Button
      component={Link}
      to={to}
      sx={{
        color: isActive ? 'primary.main' : 'white',
        backgroundColor: isActive ? 'white' : 'transparent',
        '&:hover': {
          backgroundColor: isActive ? 'white' : 'rgba(255, 255, 255, 0.08)',
        },
        mr: 1,
      }}
    >
      {children}
    </Button>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

// We extract the main content to a new component to use the useLocation hook
function AppContent() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <WarehouseIcon sx={{ mr: 1.5, fontSize: '4rem' }} />
            <Typography variant="h5" component="div">
              Smart Warehouse Management
            </Typography>
          </Box>

          <NavButton to="/">Dashboard</NavButton>
          <NavButton to="/inventory">Inventory</NavButton>
          <NavButton to="/suppliers">Suppliers</NavButton>
          <NavButton to="/alerts">Alerts</NavButton>
          <NavButton to="/reports">Reports</NavButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventory" element={<InventoryList />} />
          <Route path="/suppliers" element={<SupplierPanel />} />
          <Route path="/alerts" element={<AlertsPanel />} />
          <Route path="/reports" element={<ReportsView />} />
        </Routes>
      </Container>
    </Box>
  );
}

export default App;
