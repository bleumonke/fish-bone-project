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

interface SidebarProps {
  menuItems: MenuItem[];
}

const drawerWidth = 220;

const Sidebar: React.FC<SidebarProps> = ({ menuItems }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) setMobileOpen(false);
  };

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor:'royalblue',
        color:'white',
      }}
    >
      <List>
        {menuItems.map((item, idx) => (
          <ListItem key={idx} disablePadding>
            <ListItemButton onClick={() => item.button && handleNavigate(item.path)}>
              {item.icon && (
                <ListItemIcon sx={{ color:'white'}}>
                  {item.icon}
                </ListItemIcon>
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