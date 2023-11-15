import { AppBar, Box, Toolbar, Typography } from '@mui/material';

export const NavBar = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static' style={{ backgroundColor: '#A01818' }}>
        <Toolbar>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            Planificación de procesos
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
