import React, { useState, useEffect } from 'react';
import {
    Grid,
    Paper,
    Typography,
    Box,
    Card,
    CardContent,
    CircularProgress,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
} from '@mui/material';
import {
    Inventory as InventoryIcon,
    Warning as WarningIcon,
    LocalShipping as SupplierIcon,
    TrendingUp as TrendingIcon,
    Dashboard as DashboardIcon,
    Factory as FactoryIcon,
    Add as AddIcon,
    Assessment as AssessmentIcon,
    NotificationsActive as NotificationsActiveIcon,
    CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { reportsAPI } from '../services/api';
import { Link } from 'react-router-dom';

// A styled component for consistent card hover effects
const HoverPaper = (props) => (
    <Paper
        elevation={3}
        sx={{
            p: 3,
            height: '100%',
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
            },
        }}
        {...props}
    />
);

function Dashboard() {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSummary();
    }, []);

    const loadSummary = async () => {
        try {
            const response = await reportsAPI.getSummary();
            setSummary(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to load summary:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    const StatCard = ({ title, value, icon, color }) => (
        <Card
            sx={{
                height: '100%',
                background: `linear-gradient(135deg, ${color}22 0%, ${color}11 100%)`,
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
                },
            }}
        >
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
                <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                        {title}
                    </Typography>
                    <Typography variant="h3" component="div" sx={{ color }}>
                        {value}
                    </Typography>
                </Box>
                <Box sx={{ color, opacity: 0.6 }}>
                    {icon}
                </Box>
            </CardContent>
        </Card>
    );

    // Mock recent activity data
    const recentActivity = [
        { type: 'alert', message: 'Item "Laptop Pro" is low on stock.', icon: <WarningIcon color="warning" />, time: '2 hours ago' },
        { type: 'update', message: 'Stock for "Office Chairs" updated to 50 units.', icon: <CheckCircleIcon color="success" />, time: '5 hours ago' },
        { type: 'new_item', message: 'New item "Wireless Mouse" added to inventory.', icon: <AddIcon color="primary" />, time: '1 day ago' },
        ...summary?.alerts?.slice(0, 2).map(a => ({ type: 'alert', message: a.message, icon: <WarningIcon color="error" />, time: 'Recent' })) || []
    ];

    return (
        <Box>
            <Box display="flex" alignItems="center" sx={{ mb: 3 }}>
                <DashboardIcon sx={{ fontSize: '2.5rem', mr: 1.5, color: 'primary.main' }} />
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    Dashboard Overview
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {/* Stats Cards */}
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Total Items" value={summary?.summary?.totalItems || 0} icon={<InventoryIcon sx={{ fontSize: 50 }} />} color="#1976d2" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Low Stock Items" value={summary?.summary?.lowStockItems || 0} icon={<WarningIcon sx={{ fontSize: 50 }} />} color="#f57c00" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Total Suppliers" value={summary?.summary?.totalSuppliers || 0} icon={<SupplierIcon sx={{ fontSize: 50 }} />} color="#388e3c" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Active Alerts" value={summary?.summary?.alertCount || 0} icon={<NotificationsActiveIcon sx={{ fontSize: 50 }} />} color="#d32f2f" />
                </Grid>

                {/* Quick Actions */}
                <Grid item xs={12} sm={6} md={3}>
                    <HoverPaper>
                        <Typography variant="h6" gutterBottom>
                            Quick Actions
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                            <Button component={Link} to="/inventory" variant="contained" startIcon={<AddIcon />}>
                                Add New Item
                            </Button>
                            <Button component={Link} to="/reports" variant="outlined" startIcon={<AssessmentIcon />}>
                                Generate Report
                            </Button>
                            <Button component={Link} to="/suppliers" variant="outlined" startIcon={<SupplierIcon />}>
                                Manage Suppliers
                            </Button>
                        </Box>
                    </HoverPaper>
                </Grid>

                {/* Warehouse Utilization */}
                <Grid item xs={12} md={8}>
                    <HoverPaper>
                        <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                            <FactoryIcon sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="h6" gutterBottom sx={{ mb: 0 }}>
                                Warehouse Utilization
                            </Typography>
                        </Box>
                        {summary?.utilization && (
                            <Box>
                                <Typography variant="body1" sx={{ mt: 2 }}>
                                    Current Stock: <strong>{summary.utilization.currentStock}</strong> units
                                </Typography>
                                <Typography variant="body1">
                                    Total Capacity: <strong>{summary.utilization.totalCapacity}</strong> units
                                </Typography>
                                <Typography variant="h4" sx={{ mt: 2, color: '#1976d2' }}>
                                    {summary.utilization.utilizationPercent}% Utilized
                                </Typography>
                                <Box sx={{ mt: 2, height: 20, bgcolor: '#e0e0e0', borderRadius: 2, overflow: 'hidden' }}>
                                    <Box sx={{ height: '100%', width: `${summary.utilization.utilizationPercent}%`, bgcolor: '#1976d2', transition: 'width 0.5s ease' }} />
                                </Box>
                            </Box>
                        )}
                    </HoverPaper>
                </Grid>

                {/* Recent Activity */}
                <Grid item xs={12}>
                    <HoverPaper>
                        <Typography variant="h6" gutterBottom>
                            Recent Activity
                        </Typography>
                        <List>
                            {recentActivity.map((activity, index) => (
                                <React.Fragment key={index}>
                                    <ListItem>
                                        <ListItemIcon>{activity.icon}</ListItemIcon>
                                        <ListItemText primary={activity.message} secondary={activity.time} />
                                    </ListItem>
                                    {index < recentActivity.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    </HoverPaper>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Dashboard;
