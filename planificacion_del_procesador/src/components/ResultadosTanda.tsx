import { useContext, useEffect, useState } from "react";
import { AppContext } from "../Context";
import { Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

export const ResultadosTanda = () => {
    const { resultadoPlanificador } = useContext(AppContext);
    const [tiempoMedioRetorno, setTiempoMedioRetorno] = useState(0);
    const [tiempoCPUEnServicio, setTiempoCPUEnServicio] = useState(0);
    const [tiempoCPUEnServicioPorcentual, setTiempoCPUEnServicioPorcentual] = useState(0);

    // Calculo el tiempo medio de retorno
    useEffect(() => {
        if (resultadoPlanificador.procesosFinalizados.length > 0) {
            const tiempoMedioR = resultadoPlanificador.procesosFinalizados.reduce((sum, curr) => sum + curr.tiempoRetorno, 0);
            setTiempoMedioRetorno(tiempoMedioR / resultadoPlanificador.procesosFinalizados.length);
        }

        const tiempoCPUEnServicioAux = resultadoPlanificador.tiempoRetornoTanda
            - resultadoPlanificador.tiempoCPUDesocupada
            - resultadoPlanificador.tiempoCPUConSO;
        setTiempoCPUEnServicio(tiempoCPUEnServicioAux);

        const tiempoCPUEnServicioPorcentualAux = tiempoCPUEnServicioAux / resultadoPlanificador.tiempoRetornoTanda * 100;
        setTiempoCPUEnServicioPorcentual(tiempoCPUEnServicioPorcentualAux);

    }, [resultadoPlanificador]);

    return (
        <div style={{ margin: '1rem' }}>
            <Grid container justifyContent={'center'}>
                <Box sx={{ width: '100%' }}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }}>
                            <TableHead className="mui-table-header">
                                <TableRow>
                                    <TableCell>Tiempo de retorno de la tanda</TableCell>
                                    <TableCell>Tiempo medio de retorno</TableCell>
                                    <TableCell>T. CPU desocupada</TableCell>
                                    <TableCell>T. CPU usado por S.O.</TableCell>
                                    <TableCell>T. CPU en servicio</TableCell>
                                    <TableCell>T. CPU en servicio %</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell align="left">
                                        {resultadoPlanificador.tiempoRetornoTanda}
                                    </TableCell>

                                    <TableCell align="left">
                                        {tiempoMedioRetorno.toFixed(2)}
                                    </TableCell>

                                    <TableCell align="left">
                                        {resultadoPlanificador.tiempoCPUDesocupada}
                                    </TableCell>

                                    <TableCell align="left">
                                        {resultadoPlanificador.tiempoCPUConSO}
                                    </TableCell>

                                    <TableCell align="left">
                                        {tiempoCPUEnServicio}
                                    </TableCell>

                                    <TableCell align="left">
                                        {`${tiempoCPUEnServicioPorcentual.toFixed(2)} %`}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Grid>
        </div>
    );
}