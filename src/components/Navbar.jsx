// Navbar.jsx
import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Switch,
  FormControlLabel,
  Box
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  WbSunny as WbSunnyIcon,
  Nightlight as NightlightIcon,
} from '@mui/icons-material';

const Navbar = ({ darkMode, setDarkMode }) => {
  return (
    <AppBar 
      position="static" 
      sx={{ 
        bgcolor: '#f97316', // orange-500
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CheckCircleIcon sx={{ mr: 1, color: 'white' }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
            Task Master
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControlLabel
            control={
              <Switch 
                checked={darkMode} 
                onChange={() => setDarkMode(!darkMode)} 
                color="default"
              />
            }
            label={darkMode ? 
              <NightlightIcon sx={{ color: 'white' }} /> : 
              <WbSunnyIcon sx={{ color: 'white' }} />
            }
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;