import { useContext } from 'react';
import { styled } from '@mui/material/styles';
import { Button, Grid, Typography } from '@mui/material';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import { AppContext } from '../Context';
import { Proceso } from '../interfaces';

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
        const newProceso: Proceso = {
          id: index + 1,
          nombre: line.split(';')[0].trim(),
          tiempo_de_arribo: Number(line.split(';')[1].trim()),
          cantidad_de_rafagas: Number(line.split(';')[2].trim()),
          duracion_rafaga_cpu: Number(line.split(';')[3].trim()),
          duracion_rafaga_io: Number(line.split(';')[4].trim()),
          prioridad: Number(line.split(';')[5].trim()),
        } as Proceso;
        newProcesos.push(newProceso);
      });

      if (newProcesos.length > 0) {
        setProcesos(newProcesos);
        setStatus('cargado');
      } else {
        setProcesos([]);
        setStatus('preparado');
      }
    };

    try {
      reader.readAsText(file);
    } catch (e) {
      // console.log(e);
      setProcesos([]);
      setStatus('preparado');
    }
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
        {status === 'preparado' ? 'Subir Tanda' : 'Cambiar Tanda'}
        <VisuallyHiddenInput type='file' onChange={handleUpload} />
      </Button>
    </Grid>
  );
};
