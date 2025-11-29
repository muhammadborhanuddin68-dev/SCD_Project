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
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Chip,
    Grid,
    Card,
    CardContent,
} from '@mui/material';
import { Add as AddIcon, LocalShipping, Public } from '@mui/icons-material';
import { suppliersAPI } from '../services/api';

function SupplierPanel() {
    const [suppliers, setSuppliers] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        type: 'local',
        contact_email: '',
        contact_phone: '',
        address: '',
    });

    useEffect(() => {
        loadSuppliers();
    }, []);

    const loadSuppliers = async () => {
        try {
            const response = await suppliersAPI.getAll();
            setSuppliers(response.data);
        } catch (error) {
            console.error('Failed to load suppliers:', error);
        }
    };

    const handleSubmit = async () => {
        try {
            await suppliersAPI.create(formData);
            setOpenDialog(false);
            setFormData({
                name: '',
                type: 'local',
                contact_email: '',
                contact_phone: '',
                address: '',
            });
            loadSuppliers();
        } catch (error) {
            console.error('Failed to create supplier:', error);
        }
    };

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box display="flex" alignItems="center">
                    <LocalShipping sx={{ fontSize: '2.5rem', mr: 1.5, color: 'primary.main' }} />
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                        Supplier Management
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenDialog(true)}
                >
                    Add New Supplier
                </Button>
            </Box>

            <Grid container spacing={3}>
                {suppliers.map((supplier) => (
                    <Grid item xs={12} md={6} key={supplier.name}>
                        <Card>
                            <CardContent>
                                <Box display="flex" alignItems="center" mb={2}>
                                    {supplier.type === 'Local' ? (
                                        <LocalShipping sx={{ fontSize: 40, color: '#388e3c', mr: 2 }} />
                                    ) : (
                                        <Public sx={{ fontSize: 40, color: '#1976d2', mr: 2 }} />
                                    )}
                                    <Box>
                                        <Typography variant="h6">{supplier.name}</Typography>
                                        <Chip
                                            label={supplier.type}
                                            size="small"
                                            color={supplier.type === 'Local' ? 'success' : 'primary'}
                                        />
                                    </Box>
                                </Box>
                                <Typography variant="body2" color="textSecondary">
                                    📧 {supplier.email}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    📞 {supplier.phone}
                                </Typography>
                                <Box mt={2}>
                                    <Typography variant="caption" color="textSecondary">
                                        Delivery: {supplier.deliveryTime} | Shipping: {supplier.shippingCost}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {suppliers.length === 0 && (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography color="textSecondary">
                        No suppliers found. Add your first supplier!
                    </Typography>
                </Paper>
            )}

            {/* Add Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add New Supplier</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField
                            label="Supplier Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            select
                            label="Type"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            fullWidth
                        >
                            <MenuItem value="local">Local</MenuItem>
                            <MenuItem value="international">International</MenuItem>
                        </TextField>
                        <TextField
                            label="Email"
                            type="email"
                            value={formData.contact_email}
                            onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Phone"
                            value={formData.contact_phone}
                            onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Address"
                            multiline
                            rows={3}
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default SupplierPanel;
