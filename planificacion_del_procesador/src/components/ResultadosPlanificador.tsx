import { useContext } from 'react';
import { AppContext } from '../Context';
import { EstadoSistema } from '../interfaces';
import { Grid, Typography } from '@mui/material';
import { DiagramaGantt } from './DiagramaGantt';

export const ResultadosPlanificador = () => {
  const { status, resultadoPlanificador } = useContext(AppContext);

  return (
    <>
      {status === 'finalizado' && (
        <>
          <Grid container flexDirection={'column'} alignContent={'left'} style={{ margin: '1rem' }}>
            <Typography variant='h6' component='span'>
              Resultados - Diagrama de GANTT
            </Typography>
            <Typography variant='caption' display='block' gutterBottom color={'blue'}>
              INFO: Cada unidad de tiempo esta representada por 1segundo
            </Typography>
          </Grid>

          <DiagramaGantt />
          {/* TODO: cambiar lista por diagrama de GANTT */}
          <ul>
            {resultadoPlanificador.historialEstados.map((estado: EstadoSistema, index: number) => (
              <li key={index}>
                {estado.orden === 0 ? '[' : '('}
                {estado.orden} - {estado.orden + 1}]:
                {estado.tarea} - ({estado.procesoID}) {estado.procesoNombre}
              </li>
            ))}
          </ul>
          {/* TODO: Crear nueva data table con los datos de los procesos finalizados */}
          {/* TODO: Agregar una pequeña tarjeta o parrafo con los datos de la tanda finalizada */}
          <p>{JSON.stringify(resultadoPlanificador)}</p>
        </>
      )}
    </>
  );
};
