import React, { useState } from 'react';
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  ListItemIcon,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { MenuItem } from '../types';

// Import your auth store hook
import { useAuthStore } from '../store/useAuthStore';

const drawerWidth = 220;

interface SidebarProps {
  menuItems: MenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ menuItems }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const logout = useAuthStore(state => state.logout);

  const handleNavigate = (item: MenuItem) => {
    if (item.label.toLowerCase() === 'logout') {
      // Call logout action
      logout();
      // Redirect to login
      navigate('/login');
    } else if (item.button) {
      navigate(item.path);
    }
    if (isMobile) setMobileOpen(false);
  };

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: 'royalblue',
        color: 'white',
      }}
    >
      <List>
        {menuItems.map((item, idx) => (
          <ListItem key={idx} disablePadding>
            <ListItemButton onClick={() => handleNavigate(item)}>
              {item.icon && (
                <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
              )}
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {isMobile && (
        <IconButton
          color="inherit"
          edge="start"
          onClick={() => setMobileOpen(!mobileOpen)}
          sx={{ position: 'absolute', top: 16, left: 16, zIndex: 1300 }}
        >
          <MenuIcon />
        </IconButton>
      )}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;