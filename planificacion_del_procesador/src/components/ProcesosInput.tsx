import { useState, useContext } from 'react';
import { styled } from '@mui/material/styles';
import { Button, Grid, Typography } from '@mui/material';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import { AppContext } from '../Context';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export const ProcesosInput = () => {
  const { status } = useContext(AppContext);
  const [data, setData] = useState();

  const handleUpload = (event) => {
    console.log('uploaded file');
  };

  return (
    <Grid container justifyContent={'space-between'} style={{ margin: '1rem' }}>
      <Typography variant='h6' component='span'>
        Lista de procesos
      </Typography>
      <Button
        component='label'
        variant='contained'
        startIcon={<FormatListNumberedIcon />}
        style={{ marginRight: '2rem' }}
      >
        {' '}
        {status === 'iniciado' ? 'Subir Tanda' : 'Cambiar Tanda'}
        <VisuallyHiddenInput type='file' />
      </Button>
    </Grid>
  );
};
