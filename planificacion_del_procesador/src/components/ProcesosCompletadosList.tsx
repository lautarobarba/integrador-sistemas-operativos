import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useContext } from 'react';
import { AppContext } from '../Context';
import { Box, Grid } from '@mui/material';
import { ProcesoFinalizado } from '../interfaces';

export const ProcesosCompletadosList = () => {
  const { resultadoPlanificador } = useContext(AppContext);

  const columns: GridColDef<ProcesoFinalizado>[] = [
    {
      field: 'id',
      headerName: 'ID',
      headerClassName: 'mui-table-header',
      width: 90,
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
      field: 'tiempoServicio',
      headerName: 'Tiempo de servicio',
      headerClassName: 'mui-table-header',
      width: 150,
      editable: false,
    },
    {
      field: 'tiempoEsperaListo',
      headerName: 'Tiempo de espera listo',
      headerClassName: 'mui-table-header',
      width: 180,
      editable: false,
    },
    {
      field: 'tiempoRetorno',
      headerName: 'Tiempo de retorno (TF-TA)',
      headerClassName: 'mui-table-header',
      width: 250,
      editable: false,
      valueGetter: (params) => {
        return `${params.row.tiempoDeArribo} - ${params.row.instanteRetorno} = ${params.row.tiempoRetorno}`;
      },
    },
    {
      field: 'tiempoRetornoNormalizado',
      headerName: 'Tiempo de retorno Normalizado (TR/TS)',
      headerClassName: 'mui-table-header',
      width: 350,
      editable: false,
      valueGetter: (params) => {
        return `${params.row.tiempoRetorno} / ${params.row.tiempoServicio} = ${params.row.tiempoRetornoNormalizado.toFixed(2)}`;
      },
    },
  ];

  return (
    <>
      {resultadoPlanificador.procesosFinalizados.length > 0 && (
        <div style={{ margin: '1rem' }}>
          <Grid container justifyContent={'center'}>
            <Box sx={{ width: '100%' }}>
              <DataGrid rows={resultadoPlanificador.procesosFinalizados} columns={columns} />
            </Box>
          </Grid>
        </div>
      )}
    </>
  );
};
