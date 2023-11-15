import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useContext } from 'react';
import { AppContext } from '../Context';
import { Box, Grid } from '@mui/material';
import { Proceso } from '../interfaces';
import workSVG from '../assets/work.svg';

export const ProcesosList = () => {
  const { status, procesos } = useContext(AppContext);

  const columns: GridColDef<Proceso>[] = [
    {
      field: 'id',
      headerName: 'ID',
      headerClassName: 'mui-table-header',
      width: 90
    },
    {
      field: 'nombre',
      headerName: 'Nombre',
      headerClassName: 'mui-table-header',
      minWidth: 150,
      flex: 1,
      editable: false,
    },
    {
      field: 'tiempo_de_arribo',
      headerName: 'Timpo de arribo',
      headerClassName: 'mui-table-header',
      width: 150,
      editable: false,
    },
    {
      field: 'cantidad_de_rafagas',
      headerName: 'Cantidad de rafagas',
      headerClassName: 'mui-table-header',
      width: 150,
      editable: false,
    },
    {
      field: 'duracion_rafaga_cpu',
      headerName: 'Duración rafaga CPU',
      headerClassName: 'mui-table-header',
      width: 150,
      editable: false,
    },
    {
      field: 'duracion_rafaga_io',
      headerName: 'Duración rafaga I/O',
      headerClassName: 'mui-table-header',
      width: 150,
      editable: false,
    },
    {
      field: 'prioridad',
      headerName: 'Prioridad',
      headerClassName: 'mui-table-header',
      width: 150,
      editable: false,
    },
  ];

  return (
    <>
      {status == 'preparado' && (
        <div style={{ textAlign: 'center' }}>
          <img src={workSVG} title="Programming SVG" alt="Programming SVG" style={{ maxWidth: '40%' }} />
          <p style={{ fontWeight: 'bold', color: 'red' }}>
            Por favor cargue una tande de procesos para continuar...
          </p>
        </div>
      )}
      {status !== 'preparado' && (
        <div style={{ margin: '1rem' }}>
          <Grid container justifyContent={'center'}>
            <Box sx={{ width: '100%', minHeight: '200px' }}>
              <DataGrid
                rows={procesos}
                columns={columns}
              />
            </Box>
          </Grid>
        </div>
      )}
    </>
  );
};
