import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

interface ConfirmDeleteDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  open,
  onCancel,
  onConfirm,
}) => (
  <Dialog open={open} onClose={onCancel}>
    <DialogTitle>Delete Bone</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Are you sure you want to delete this bone and all of its children?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onCancel}>Cancel</Button>
      <Button onClick={onConfirm} color="error">Delete</Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDeleteDialog;
