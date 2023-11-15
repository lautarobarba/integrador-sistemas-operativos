import { useContext } from "react";
import { AppContext } from "../Context";
import { EstadoSistema } from "../interfaces";

export const ResultadosPlanificador = () => {
    const { status, resultadoPlanificador } = useContext(AppContext);

    return (
        <>
            {status === 'finalizado' && (
                <>
                    <hr />
                    <p>ResultadosPlanificador</p>
                    <ul>
                        {resultadoPlanificador.historialEstados.map((estado: EstadoSistema) =>
                            <li key={estado.orden}>{estado.orden}: {estado.tarea} - ({estado.procesoID}) {estado.procesoNombre}</li>
                        )}
                    </ul>
                    <p>{JSON.stringify(resultadoPlanificador)}</p>
                </>
            )}
        </>
    );
}