import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, QrCode as QrCodeIcon, Inventory as InventoryIcon } from '@mui/icons-material';
import { itemsAPI } from '../services/api';

function InventoryList() {
  const [items, setItems] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    type: 'bulk',
    quantity: 0,
    threshold: 10,
    zone: 'Zone A',
    rack: 'Rack A1',
    bin: 'Bin A1-1',
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const response = await itemsAPI.getAll();
      setItems(response.data);
    } catch (error) {
      console.error('Failed to load items:', error);
    }
  };

  const handleOpenDialog = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        sku: item.sku,
        name: item.name,
        type: item.type,
        quantity: item.quantity,
        threshold: item.threshold,
        zone: item.location?.split('-')[0] || 'Zone A',
        rack: item.location?.split('-')[1] || 'Rack A1',
        bin: item.location?.split('-')[2] || 'Bin A1-1',
      });
    } else {
      setEditingItem(null);
      setFormData({
        sku: '',
        name: '',
        type: 'bulk',
        quantity: 0,
        threshold: 10,
        zone: 'Zone A',
        rack: 'Rack A1',
        bin: 'Bin A1-1',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingItem(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingItem) {
        await itemsAPI.updateStock(editingItem.id, formData.quantity);
      } else {
        await itemsAPI.create(formData);
      }
      handleCloseDialog();
      loadItems();
    } catch (error) {
      console.error('Failed to save item:', error);
    }
  };

  const getStatusChip = (item) => {
    if (item.quantity === 0) {
      return <Chip label="Out of Stock" size="small" color="error" />;
    } else if (item.quantity <= item.threshold) {
      return <Chip label="Low Stock" size="small" color="warning" />;
    } else {
      return <Chip label="In Stock" size="small" color="success" />;
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center">
          <InventoryIcon sx={{ fontSize: '2.5rem', mr: 1.5, color: 'primary.main' }} />
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Inventory Management
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add New Item
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell><strong>SKU</strong></TableCell>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Type</strong></TableCell>
              <TableCell><strong>Quantity</strong></TableCell>
              <TableCell><strong>Threshold</strong></TableCell>
              <TableCell><strong>Location</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Labels</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell>{item.sku}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  <Chip label={item.type} size="small" variant="outlined" />
                </TableCell>
                <TableCell>
                  <Typography variant="h6" color={item.quantity <= item.threshold ? 'error' : 'inherit'}>
                    {item.quantity}
                  </Typography>
                </TableCell>
                <TableCell>{item.threshold}</TableCell>
                <TableCell>
                  <Typography variant="caption" display="block">
                    {item.location}
                  </Typography>
                </TableCell>
                <TableCell>{getStatusChip(item)}</TableCell>
                <TableCell>
                  {item.labels?.map((label, idx) => (
                    <Chip
                      key={idx}
                      label={label.label_type}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5 }}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </TableCell>
                <TableCell>
                  <Tooltip title="Update Stock">
                    <IconButton size="small" onClick={() => handleOpenDialog(item)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {item.qrEnabled && (
                    <Tooltip title={`QR: ${item.qrCode}`}>
                      <IconButton size="small">
                        <QrCodeIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingItem ? 'Update Stock' : 'Add New Item'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="SKU"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              disabled={!!editingItem}
              fullWidth
            />
            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={!!editingItem}
              fullWidth
            />
            <TextField
              select
              label="Type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              disabled={!!editingItem}
              fullWidth
            >
              <MenuItem value="bulk">Bulk</MenuItem>
              <MenuItem value="perishable">Perishable</MenuItem>
              <MenuItem value="electronic">Electronic</MenuItem>
            </TextField>
            <TextField
              label="Quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
              fullWidth
            />
            <TextField
              label="Threshold"
              type="number"
              value={formData.threshold}
              onChange={(e) => setFormData({ ...formData, threshold: parseInt(e.target.value) })}
              disabled={!!editingItem}
              fullWidth
            />
            {!editingItem && (
              <>
                <TextField
                  label="Zone"
                  value={formData.zone}
                  onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                  fullWidth
                />
                <TextField
                  label="Rack"
                  value={formData.rack}
                  onChange={(e) => setFormData({ ...formData, rack: e.target.value })}
                  fullWidth
                />
                <TextField
                  label="Bin"
                  value={formData.bin}
                  onChange={(e) => setFormData({ ...formData, bin: e.target.value })}
                  fullWidth
                />
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingItem ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default InventoryList;
