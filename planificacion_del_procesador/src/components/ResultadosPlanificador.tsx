import { useContext } from "react";
import { AppContext } from "../Context";

export const ResultadosPlanificador = () => {
    const { status, resultadoPlanificador } = useContext(AppContext);

    return (
        <>
            {status === 'finalizado' && (
                <>
                    <p>ResultadosPlanificador</p>
                    <p>{JSON.stringify(resultadoPlanificador)}</p>
                </>
            )}
        </>
    );
}