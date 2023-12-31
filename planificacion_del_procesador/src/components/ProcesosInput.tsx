import { useContext } from 'react';
import { styled } from '@mui/material/styles';
import { Button, Grid, Typography } from '@mui/material';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import { AppContext } from '../Context';
import { Proceso } from '../interfaces';
import { enqueueSnackbar } from 'notistack';

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
  const { status, setProcesos, setStatus } = useContext(AppContext);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpload = (event: any) => {
    const file: File = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const newData: string[] = reader.result?.toString().split('\n') ?? [];
      const parseData: string[] = newData.filter((line: string) => {
        // Comienzo quitando los espacios de cada renglon para analizar la linea del archivo
        const trimmedLine: string = line.trim();
        // Una linea que representa un proceso cumple dos requisitos.
        // No contiene el caracter '#'
        if (trimmedLine.indexOf('#') >= 0) return false;
        // Tiene 6 atributos ordenados que indican:
        // 1-NOMBRE_PROCESO
        // 2-TIEMPO_ARRIBO
        // 3-CANTIDAD_RAFAGAS
        // 4-DURACION_RAFAGAS_CPU
        // 5-DURACION_RAFAGAS_IO
        // 6-PRIORIDAD
        if (trimmedLine.split(';').length !== 6) return false;
        // La linea es capaz de representar un proceso
        return true;
      });

      const newProcesos: Proceso[] = [];
      parseData.forEach((line: string, index: number) => {
        // Formato de cada linea del archivo:
        //  NOMBRE_PROCESO;TIEMPO_ARRIBO;CANTIDAD_RAFAGAS;DURACION_RAFAGAS_CPU;DURACION_RAFAGAS_IO;PRIORIDAD
        const nombreProceso: string = line.split(';')[0].trim();
        const tiempoDeArribo: number = Number(line.split(';')[1].trim());
        const cantidadDeRafagasCPU: number = Number(line.split(';')[2].trim());
        const duracionRafagaCPU: number = Number(line.split(';')[3].trim());
        const cantidadDeRafagasIO: number = cantidadDeRafagasCPU > 1 ? cantidadDeRafagasCPU - 1 : 0;
        const duracionRafagaIO: number =
          cantidadDeRafagasIO > 0 ? Number(line.split(';')[4].trim()) : 0;
        const prioridad: number = Number(line.split(';')[5].trim());

        const newProceso: Proceso = {
          id: index + 1,
          nombre: nombreProceso,
          tiempoDeArribo: tiempoDeArribo,
          cantidadDeRafagasCPU: cantidadDeRafagasCPU,
          duracionRafagaCPU: duracionRafagaCPU,
          cantidadDeRafagasIO: cantidadDeRafagasIO,
          duracionRafagaIO: duracionRafagaIO,
          prioridad: prioridad,
        } as Proceso;
        newProcesos.push(newProceso);
      });

      if (newProcesos.length > 0) {
        setProcesos(newProcesos);
        setStatus('cargado');
        enqueueSnackbar('¡Tanda de procesos cargada correctamente!', {
          anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
          variant: 'success',
        });
      } else {
        setProcesos([]);
        setStatus('preparado');
        enqueueSnackbar('Error: la tanda no contenia procesos...', {
          anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
          variant: 'error',
        });
      }
    };

    try {
      reader.readAsText(file);
    } catch (e) {
      // console.log(e);
      setProcesos([]);
      setStatus('preparado');
      enqueueSnackbar('Tanda borrada. Suba la tanda nuevamente...', {
        anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
        variant: 'info',
      });
    }
  };

  return (
    <Grid
      container
      justifyContent={{ xs: 'center', sm: 'space-between' }}
      alignContent={'center'}
      flexDirection={{ xs: 'column', sm: 'row' }}
      style={{ padding: '1rem' }}
      textAlign={{ xs: 'center', sm: 'left' }}
    >
      <Typography variant='h6' component='span'>
        Lista de procesos
      </Typography>
      <Button component='label' variant='contained' startIcon={<FormatListNumberedIcon />}>
        {status === 'preparado' ? 'Subir Tanda' : 'Cambiar Tanda'}
        <VisuallyHiddenInput type='file' onChange={handleUpload} />
      </Button>
    </Grid>
  );
};
