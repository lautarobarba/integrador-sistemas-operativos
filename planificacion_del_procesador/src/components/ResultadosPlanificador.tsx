import { useContext } from 'react';
import { AppContext } from '../Context';
import { EstadoSistema } from '../interfaces';
import { Grid, Typography } from '@mui/material';
import { DiagramaGantt } from './DiagramaGantt';
import { ProcesosCompletadosList } from './ProcesosCompletadosList';
import { ResultadosTanda } from './ResultadosTanda';

export const ResultadosPlanificador = () => {
  const { status } = useContext(AppContext);

  return (
    <>
      {status === 'finalizado' && (
        <div data-aos="fade-up">
          <Grid container flexDirection={'column'} alignContent={'left'} style={{ margin: '1rem' }}>
            <Typography variant='h6' component='span'>
              Resultados Tanda
            </Typography>
          </Grid>
          <ResultadosTanda />

          <Grid container flexDirection={'column'} alignContent={'left'} style={{ margin: '1rem' }}>
            <Typography variant='h6' component='span'>
              Resultados procesos completados
            </Typography>
          </Grid>
          <ProcesosCompletadosList />

          <Grid container flexDirection={'column'} alignContent={'left'} style={{ margin: '1rem' }}>
            <Typography variant='h6' component='span'>
              Resultados - Diagrama de GANTT
            </Typography>
            <Typography variant='caption' display='block' gutterBottom color={'blue'}>
              INFO: Cada unidad de tiempo esta representada por 1segundo
            </Typography>
          </Grid>
          <DiagramaGantt />
        </div>
      )}
    </>
  );
};
