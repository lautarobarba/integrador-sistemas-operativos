import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useContext } from 'react';
import { AppContext } from '../Context';
import { Box, Grid } from '@mui/material';
import { Proceso } from '../interfaces/Proceso.interface';

export const ProcesosList = () => {
  const { status, procesos } = useContext(AppContext);

  const columns: GridColDef<Proceso>[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'nombre',
      headerName: 'Nombre',
      width: 150,
      editable: false,
    },
  ];

  //   const rows: Proceso[] = [];

  return (
    <>
      {status == 'iniciado' && (
        <p style={{ textAlign: 'center', fontWeight: 'bold', color: 'red' }}>
          Por favor cargue una tande de procesos para continuar...
        </p>
      )}
      {status !== 'iniciado' && (
        <Grid container justifyContent={'center'}>
          <Box sx={{ width: '95%' }}>
            <DataGrid
              rows={procesos}
              columns={columns}
              //   pagination={false}
              //   initialState={{
              //     pagination: {
              //       paginationModel: {
              //         pageSize: 5,
              //       },
              //     },
              //   }}
              //   pageSizeOptions={[5]}
              //   checkboxSelection
              disableRowSelectionOnClick
            />
          </Box>
        </Grid>
      )}
    </>
  );
};
