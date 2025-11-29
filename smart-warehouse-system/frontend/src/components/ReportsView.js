import React, { useState, useEffect } from 'react';
import {
    Paper,
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Grid,
    Button,
} from '@mui/material';
import { Download as DownloadIcon, Assessment as AssessmentIcon ,Add as AddIcon, LocalShipping, Public} from '@mui/icons-material';
import { reportsAPI } from '../services/api';

function ReportsView() {
    const [lowStockReport, setLowStockReport] = useState([]);
    const [supplierReport, setSupplierReport] = useState([]);

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        try {
            const [lowStock, suppliers] = await Promise.all([
                reportsAPI.getLowStock(),
                reportsAPI.getSupplierPerformance(),
            ]);
            setLowStockReport(lowStock.data);
            setSupplierReport(suppliers.data);
        } catch (error) {
            console.error('Failed to load reports:', error);
        }
    };

    const handleExport = (data, filename) => {
        // Simple CSV export
        const headers = Object.keys(data[0] || {}).join(',');
        const rows = data.map((row) => Object.values(row).join(',')).join('\n');
        const csv = `${headers}\n${rows}`;
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.csv`;
        a.click();
    };

    return (
        <Box>
            <Box display="flex" alignItems="center" sx={{ mb: 3 }}>
                <AssessmentIcon sx={{ fontSize: '2.5rem', mr: 1.5, color: 'primary.main' }} />
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    Reports & Analytics
                </Typography>
            </Box>


            <Grid container spacing={3}>
                {/* Low Stock Report */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6">⚠️ Low Stock Report</Typography>
                            <Button
                                startIcon={<DownloadIcon />}
                                onClick={() => handleExport(lowStockReport, 'low-stock-report')}
                                disabled={lowStockReport.length === 0}
                            >
                                Export CSV
                            </Button>
                        </Box>
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                        <TableCell><strong>SKU</strong></TableCell>
                                        <TableCell><strong>Name</strong></TableCell>
                                        <TableCell><strong>Current Qty</strong></TableCell>
                                        <TableCell><strong>Threshold</strong></TableCell>
                                        <TableCell><strong>Deficit</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {lowStockReport.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{item.sku}</TableCell>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>
                                                <Typography color="error" fontWeight={600}>
                                                    {item.quantity}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>{item.threshold}</TableCell>
                                            <TableCell>
                                                <Typography color="error">-{item.deficit}</Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {lowStockReport.length === 0 && (
                            <Box p={2} textAlign="center">
                                <Typography color="textSecondary">
                                    All items are above threshold levels
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                {/* Supplier Performance */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6">🚚 Supplier Performance</Typography>
                            <Button
                                startIcon={<DownloadIcon />}
                                onClick={() => handleExport(supplierReport, 'supplier-performance')}
                                disabled={supplierReport.length === 0}
                            >
                                Export CSV
                            </Button>
                        </Box>
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                        <TableCell><strong>Supplier Name</strong></TableCell>
                                        <TableCell><strong>Type</strong></TableCell>
                                        <TableCell><strong>Item Count</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {supplierReport.map((supplier) => (
                                        <TableRow key={supplier.id}>
                                            <TableCell>{supplier.name}</TableCell>
                                            <TableCell>{supplier.type}</TableCell>
                                            <TableCell>
                                                <Typography fontWeight={600}>{supplier.item_count}</Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

export default ReportsView;
