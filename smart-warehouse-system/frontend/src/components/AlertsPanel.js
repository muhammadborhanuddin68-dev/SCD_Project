import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton,
  Divider,
} from '@mui/material';
import { CheckCircle as CheckIcon, Notifications as NotificationsIcon } from '@mui/icons-material';

import { alertsAPI } from '../services/api';

function AlertsPanel() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    loadAlerts();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadAlerts = async () => {
    try {
      const response = await alertsAPI.getAll();
      setAlerts(response.data);
    } catch (error) {
      console.error('Failed to load alerts:', error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await alertsAPI.markAsRead(id);
      loadAlerts();
    } catch (error) {
      console.error('Failed to mark alert as read:', error);
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'out_of_stock':
        return '#d32f2f';
      case 'critical_stock':
        return '#f57c00';
      case 'low_stock':
        return '#ffa726';
      default:
        return '#1976d2';
    }
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" sx={{ mb: 3 }}>
        <NotificationsIcon sx={{ fontSize: '2.5rem', mr: 1.5, color: 'primary.main' }} />
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Stock Alerts & Notifications
        </Typography>
      </Box>


      <Paper>
        <List>
          {alerts.map((alert, index) => (
            <React.Fragment key={alert.id}>
              <ListItem
                sx={{
                  bgcolor: alert.is_read ? 'transparent' : '#f5f5f5',
                  borderLeft: `4px solid ${getAlertColor(alert.alert_type)}`,
                  opacity: alert.is_read ? 0.6 : 1,
                }}
                secondaryAction={
                  !alert.is_read && (
                    <IconButton edge="end" onClick={() => handleMarkAsRead(alert.id)}>
                      <CheckIcon />
                    </IconButton>
                  )
                }
              >
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {alert.item_name} ({alert.sku})
                      </Typography>
                      <Chip
                        label={alert.alert_type.replace('_', ' ')}
                        size="small"
                        sx={{
                          bgcolor: getAlertColor(alert.alert_type),
                          color: 'white',
                          textTransform: 'uppercase',
                        }}
                      />
                    </Box>
                  }
                  secondary={
                    <Box mt={1}>
                      <Typography variant="body2" color="textSecondary">
                        {alert.message}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {new Date(alert.created_at).toLocaleString()}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              {index < alerts.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>

        {alerts.length === 0 && (
          <Box p={4} textAlign="center">
            <Typography color="textSecondary">
              ✅ No alerts at the moment. All stock levels are healthy!
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default AlertsPanel;
