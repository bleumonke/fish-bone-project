import React from 'react';
import {
    Snackbar,
    Alert
} from '@mui/material';
import { NotificationProps } from '../types';

const Notification: React.FC<NotificationProps> = ({
  open,
  message,
  severity = 'info',
  onClose,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;