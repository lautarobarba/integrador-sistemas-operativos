import { AppBar, Box, Grid, Toolbar } from '@mui/material';
import { useContext, useState } from 'react';
import { AppContext } from '../Context';
import HelpIcon from '@mui/icons-material/Help';
import { ModalConsigna } from './ModalConsigna';

export const NavBar = () => {
  const { status } = useContext(AppContext);
  const [showConsigna, setShowConsigna] = useState<boolean>(false);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static' style={{ backgroundColor: '#A01818' }}>
        <Toolbar>
          <Grid
            container
            flexDirection={{ xs: 'column', sm: 'row' }}
            justifyContent={{ xs: 'center', sm: 'space-between' }}
            alignContent={{ xs: 'left', sm: 'baseline' }}
            paddingTop={{ xs: '0.5rem', sm: 0 }}
            paddingBottom={{ xs: '0.5rem', sm: 0 }}
          >
            <span
              style={{
                margin: 0,
                fontFamily: "Roboto",
                lineHeight: '1.6rem',
                fontWeight: 500,
                fontSize: '1.25rem',
                letterSpacing: '0.0075em'
              }}>Planificación de procesos</span>

            <Grid item display={{ xs: 'none', sm: 'block' }}>
              <span onClick={() => setShowConsigna(!showConsigna)}><HelpIcon /></span>
            </Grid>
            <ModalConsigna showModal={showConsigna} setShowModal={setShowConsigna} />

            <span
              style={{
                margin: 0,
                fontFamily: "Roboto",
                lineHeight: '1.6rem',
                fontSize: '1rem'
              }}>ESTADO [{status.toUpperCase()}]</span>
          </Grid>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
