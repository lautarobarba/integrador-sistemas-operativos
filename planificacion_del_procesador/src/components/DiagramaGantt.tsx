import { useContext, useEffect, useState } from "react";
import { AppContext } from "../Context";
import { EstadoSistema } from "../interfaces";
import Chart from "react-google-charts";
// import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis, Tooltip } from "recharts";



export const DiagramaGantt = () => {
    const { resultadoPlanificador } = useContext(AppContext);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [rows, setRows] = useState<any[]>([]);
    const [processesCount, setProcessesCount] = useState<number>(0);

    const columns = [
        { type: "string", id: "proceso" },
        { type: "string", id: "tipo_ejecucion" },
        { type: 'string', id: 'style', role: 'style' },
        // { type: "string", role: "tooltip" },
        { type: "number", id: "start" },
        { type: "number", id: "end" },
    ];

    // const rows = [
    //     // ["NOMBRE_PROCESO", "TIPO_BLOQUE", "COLOR", "TOOLTIP_TAG", INICIO, FIN],
    //     ["Jefferson", "io", "grey", 0, 1500],
    //     ["Proceso1", "cpu", "green", 2000, 3000],
    //     ["Proceso1", "tip", "blue", 1000, 2000],
    //     ["Proceso1", "cpu", "red", 3000, 4000],
    //     ["Washington", "ejecucion_1", "red", 6000, 8000],
    //     ["Adams", "tip", "red", 1000, 4000],
    //     ["Jefferson", "tip", "red", 4000, 6000],
    //     ["Jefferson", "tip", "red", 40000, 45000],
    // ];

    // const data = [columns, ...rows];

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rowsAux: any[] = [];
        const processesNamesSet: Set<string> = new Set();
        let estado: EstadoSistema;
        for (let i = 0; i < resultadoPlanificador.historialEstados.length; i++) {
            estado = resultadoPlanificador.historialEstados[i];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const newRow: any[] = [];

            if (estado.tarea !== 'esperando_idle' && estado.procesoNombre) {

                let blocColor: string = 'grey';
                switch (estado.tarea) {
                    case 'ejecutando_cpu':
                        blocColor = 'green';
                        break;
                    default:
                        blocColor = 'grey';
                        break;
                }

                // ["NOMBRE_PROCESO", "TIPO_BLOQUE", "COLOR", INICIO, FIN]
                newRow[0] = estado.procesoNombre ?? "";
                newRow[1] = estado.tarea;
                newRow[2] = blocColor;
                newRow[3] = estado.orden * 1000;
                newRow[4] = (estado.orden + 1) * 1000;
                rowsAux.push(newRow);
                processesNamesSet.add(estado.procesoNombre);
            }
        }
        console.log(rowsAux);
        setRows(rowsAux);
        console.log(processesNamesSet.size);
        setProcessesCount(processesNamesSet.size);

    }, [resultadoPlanificador]);

    return (
        <>
            {/* <div style={{ overflowX: 'scroll', margin: '1rem' }}> */}
            <Chart
                chartType="Timeline"
                data={[columns, ...rows]}
                height={`${200 * processesCount}px`}
                options={{
                    hAxis: {
                        format: "s",
                        minValue: 0,
                        maxValue: 999,
                    },
                    allowHtml: true,
                    timeline: {
                        groupByRowLabel: true,
                    },
                    legend: {
                        position: 'top'
                    },
                }}
            />
            {/* </div> */}
        </>
    );
}