import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../Context';
import { EstadoSistema } from '../interfaces';
import Chart from 'react-google-charts';
// import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis, Tooltip } from "recharts";

export const DiagramaGantt = () => {
    const { resultadoPlanificador } = useContext(AppContext);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [rows, setRows] = useState<any[]>([]);
    // const [processesCount, setProcessesCount] = useState<number>(0);

    const columns = [
        { type: 'string', id: 'proceso' },
        { type: 'string', id: 'tipo_ejecucion' },
        { type: 'string', id: 'style', role: 'style' },
        // { type: "string", role: "tooltip" },
        { type: 'number', id: 'start' },
        { type: 'number', id: 'end' },
    ];

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rowsAux: any[] = [];
        const processesNamesSet: Set<string> = new Set();
        let estado: EstadoSistema;
        // console.log(resultadoPlanificador.historialEstados);
        for (let i = 0; i < resultadoPlanificador.historialEstados.length; i++) {
            estado = resultadoPlanificador.historialEstados[i];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const newRow: any[] = [];

            if (estado.tarea !== 'esperando_idle' && estado.procesoNombre) {
                let blocColor: string;
                let tag: string;
                switch (estado.tarea) {
                    case 'ejecutando_tip':
                        blocColor = 'grey';
                        tag = 'TIP';
                        break;
                    case 'ejecutando_tcp':
                        blocColor = 'grey';
                        tag = 'TCP';
                        break;
                    case 'ejecutando_cpu':
                        blocColor = 'green';
                        tag = 'CPU';
                        break;
                    case 'esperando_io':
                        blocColor = 'yellow';
                        tag = 'I/O';
                        break;
                    case 'ejecutando_tfp':
                        blocColor = 'grey';
                        tag = 'TFP';
                        break;
                    default:
                        blocColor = 'red';
                        tag = 'ERROR';
                        break;
                }

                // ["NOMBRE_PROCESO", "TIPO_BLOQUE", "COLOR", INICIO, FIN]
                newRow[0] = (estado.procesoID && estado.procesoNombre)
                    ? `${estado.procesoID}. ${estado.procesoNombre}`
                    : 'Error';
                newRow[1] = tag;
                newRow[2] = blocColor;
                newRow[3] = estado.orden * 1000;
                newRow[4] = (estado.orden + 1) * 1000;
                rowsAux.push(newRow);
                processesNamesSet.add(estado.procesoNombre);
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rowsAux.sort((a: any, b: any) => (b[0] < a[0] ? -1 : 1));
        setRows(rowsAux);
        // setProcessesCount(processesNamesSet.size);
    }, [resultadoPlanificador]);

    return (
        <>
            {/* <div style={{ overflowX: 'scroll', margin: '1rem' }}> */}
            <Chart
                chartType='Timeline'
                data={[columns, ...rows]}
                // height={`${10 * processesCount}px`}
                height={500}
                options={{
                    hAxis: {
                        format: 'mm:ss',
                        minValue: 0,
                        maxValue: 999,
                    },
                    allowHtml: true,
                    timeline: {
                        groupByRowLabel: true,
                    },
                    legend: {
                        position: 'top',
                    },
                }}
                style={{ margin: '1rem' }}
            // style={{ margin: '1rem', border: '1px solid black' }}
            />
            {/* </div> */}
        </>
    );
};
