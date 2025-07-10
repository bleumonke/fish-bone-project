import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar from '../components/SideBar';
import { MenuItem } from '../types';
import HomeIcon from '@mui/icons-material/Home';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const menuItems: MenuItem[] = [
  { label: 'Home', path: '/', button: true, icon: <HomeIcon /> },
  { label: 'Logout', path: '/logout', button: true, icon: <ExitToAppIcon /> },
];

const MainLayout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar menuItems={menuItems} />
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
