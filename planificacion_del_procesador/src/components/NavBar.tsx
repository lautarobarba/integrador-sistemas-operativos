import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import { useContext } from 'react';
import { AppContext } from '../Context';

export const NavBar = () => {
  const { status } = useContext(AppContext);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static' style={{ backgroundColor: '#A01818' }}>
        <Toolbar>
          <Typography variant='h6' component='span' sx={{ flexGrow: 1, cursor: 'pointer' }}>
            Planificación de procesos
          </Typography>
          <span>ESTADO: [{status.toUpperCase()}]</span>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
