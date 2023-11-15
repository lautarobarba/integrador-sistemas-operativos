import { useContext } from "react";
import { AppContext } from "../Context";
import { EstadoSistema } from "../interfaces";
import { Grid, Typography } from "@mui/material";

export const ResultadosPlanificador = () => {
    const { status, resultadoPlanificador } = useContext(AppContext);

    return (
        <>
            {status === 'finalizado' && (
                <>
                    <Grid container justifyContent={'left'} style={{ margin: '1rem' }}>
                        <Typography variant='h6' component='span'>
                            Resultados - Diagrama de GANTT
                        </Typography>
                    </Grid>
                    {/* TODO: cambiar lista por diagrama de gant */}
                    <ul>
                        {resultadoPlanificador.historialEstados.map((estado: EstadoSistema) =>
                            <li key={estado.orden}>
                                {estado.orden === 1 ? '[' : '('}{estado.orden - 1} - {estado.orden}]:
                                {estado.tarea} - ({estado.procesoID}) {estado.procesoNombre}
                            </li>
                        )}
                    </ul>
                    {/* TODO: Crear nueva data table con los datos de los procesos finalizados */}
                    {/* TODO: Agregar una pequeña tarjeta o parrafo con los datos de la tanda finalizada */}
                    <p>{JSON.stringify(resultadoPlanificador)}</p>
                </>
            )}
        </>
    );
}