import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  CircularProgress,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import InboxIcon from '@mui/icons-material/Inbox';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { useDiagramStore } from '../store/useDiagramStore';
import Notification from '../components/Notification';
import { Bone } from '../types';
import { useAuthStore } from '../store/useAuthStore';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const { diagrams, loading, error, fetchDiagrams, addDiagram } = useDiagramStore();
  const token = useAuthStore(state => state.token);
  const user = useAuthStore(state => state.user);
  const fetchUserProfile = useAuthStore(state => state.fetchUserProfile);

  const [search, setSearch] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [newDiagramName, setNewDiagramName] = useState('');
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationSeverity, setNotificationSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');

  useEffect(() => {
    if (token && !user) {
      fetchUserProfile().catch(() => {});
    }
  }, [token, user, fetchUserProfile]);

  useEffect(() => {
    fetchDiagrams();
  }, [fetchDiagrams]);

  useEffect(() => {
    if (error) {
      setNotificationSeverity('error');
      setNotificationMessage(error);
      setNotificationOpen(true);
    }
  }, [error]);

  const handleRowClick = (params: any) => {
    navigate(`/diagram/${params.row.id}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleAddDiagramClick = () => {
    setNewDiagramName('');
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleSaveDiagram = async () => {
    if (!newDiagramName.trim()) {
      setNotificationSeverity('error');
      setNotificationMessage('Diagram name cannot be empty.');
      setNotificationOpen(true);
      return;
    }

    await addDiagram(newDiagramName.trim());

    setOpenDialog(false);
    setNotificationSeverity('success');
    setNotificationMessage('Diagram added successfully!');
    setNotificationOpen(true);
  };

  const handleNotificationClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') return;
    setNotificationOpen(false);
  };

  // Recursive count bones helper
  const countBones = (bones: Bone[]): number => {
    return bones.reduce((acc, bone) => {
      const childrenCount = bone.children ? countBones(bone.children) : 0;
      return acc + 1 + childrenCount;
    }, 0);
  };

  const filteredRows = diagrams
    .filter(({ title }) => title.toLowerCase().includes(search.toLowerCase()))
    .map(({ id, title, createdBy, createdAt, updatedAt, bones }) => ({
      id,
      title,
      createdBy,
      createdAt,
      updatedAt: updatedAt ?? createdAt,
      bonesCount: (bones ?? []).length,
      totalBonesCount: countBones(bones ?? []),
    }));

  const columns: GridColDef[] = [
    {
      field: 'title',
      headerName: 'Title',
      flex: 2,
      minWidth: 150,
    },
    {
      field: 'bonesCount',
      headerName: 'Top-Level Bones',
      flex: 1,
      minWidth: 80,
      type: 'number',
    },
    {
      field: 'totalBonesCount',
      headerName: 'Total Bones',
      flex: 1,
      minWidth: 80,
      type: 'number',
    },
    {
      field: 'createdBy',
      headerName: 'Created By',
      flex: 1,
      minWidth: 120,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            width: '100%',
            pr: 1,
            height: '50px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              minWidth: 0,
              justifyContent: 'space-evenly',
            }}
          >
            <Box sx={{ width: 20, display: 'flex', justifyContent: 'center' }}>
              <AccountCircleIcon fontSize="small" color="action" />
            </Box>
            <Box>
              <Typography
                variant="body2"
                noWrap
                sx={{ textAlign: 'right', maxWidth: '100%' }}
              >
                {params.value}
              </Typography>
            </Box>
          </Box>
        </Box>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      flex: 1.5,
      minWidth: 180,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params: any) => {
        const dateStr = params.row.createdAt;
        const date = new Date(dateStr);
        return isNaN(date.getTime())
          ? ''
          : date.toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });
      },
    },
    {
      field: 'updatedAt',
      headerName: 'Updated At',
      flex: 1.5,
      minWidth: 180,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params: any) => {
        const dateStr = params.row.updatedAt || params.row.createdAt;
        const date = new Date(dateStr);
        return isNaN(date.getTime())
          ? ''
          : date.toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });
      },
    },
  ];

  return (
    <>
      {/* Greeting top-right */}
      {user?.fullName && (
        <Box
          sx={{
            position: 'fixed',
            top: 16,
            right: 16,
            bgcolor: 'background.paper',
            px: 2,
            py: 1,
            borderRadius: 2,
            boxShadow: 3,
            zIndex: 1300,
            userSelect: 'none',
          }}
        >
          <Typography variant="subtitle1" color="text.primary">
            Welcome, {user.fullName}!
          </Typography>
        </Box>
      )}

      {/* Main centered container */}
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          px: 2,
          boxSizing: 'border-box',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 1200 }}>
          <Typography variant="h4" mb={2} align="left">
            Ishwaka Diagrams
          </Typography>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: 2,
              mb: 3,
              flexWrap: 'wrap',
            }}
          >
            <TextField
              label="Search Diagrams"
              variant="outlined"
              size="small"
              value={search}
              onChange={handleSearchChange}
              sx={{ width: '300px', maxWidth: '100%' }}
              disabled={loading}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddDiagramClick}
              disabled={loading}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Add Diagram
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <DataGrid
              rows={filteredRows}
              columns={columns}
              pageSizeOptions={[5]}
              initialState={{
                pagination: { paginationModel: { pageSize: 5, page: 0 } },
              }}
              onRowClick={handleRowClick}
              autoHeight
              sx={{
                '& .MuiDataGrid-row:hover': {
                  cursor: 'pointer',
                },
                overflowX: 'auto',
              }}
              slots={{
                noRowsOverlay: () => (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      color: 'text.secondary',
                    }}
                  >
                    <InboxIcon sx={{ fontSize: 50, mb: 1 }} />
                    <Typography>No diagrams found</Typography>
                  </Box>
                ),
              }}
            />
          )}
        </Box>
      </Box>

      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 2,
            padding: 3,
            bgcolor: 'background.paper',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.25rem', pb: 2 }}>
          Add New Diagram
        </DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            margin="normal"
            label="Diagram Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newDiagramName}
            onChange={(e) => setNewDiagramName(e.target.value)}
            sx={{ mt: 1 }}
            disabled={loading}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleDialogClose} color="secondary" disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveDiagram}
            variant="contained"
            color="primary"
            disableElevation
            disabled={loading}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Notification
        open={notificationOpen}
        message={notificationMessage}
        severity={notificationSeverity}
        onClose={handleNotificationClose}
      />
    </>
  );
};

export default Home;
