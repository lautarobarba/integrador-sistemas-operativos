import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../Context";
import { ejecutarPlanificacion } from "../services/planificador";
import { ResultadoPlanificador } from "../interfaces";

export const PlanificadorForm = () => {
    const { status, setStatus, procesos, planificador, setPlanificador, setResultadoPlanificador } = useContext(AppContext);

    const [politicaInput, setPoliticaInput] = useState<'fcfs' | 'rr' | 'spn' | 'srtn' | 'pe'>("fcfs");
    const [quantumInput, setQuantumInput] = useState<number>(0);
    const [tipInput, setTipInput] = useState<number>(0);
    const [tfpInput, setTfpInput] = useState<number>(0);
    const [tcpInput, setTcpInput] = useState<number>(0);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ejecutarTanda = async (event: any) => {
        event.preventDefault();
        const resultado: ResultadoPlanificador = await ejecutarPlanificacion(planificador);
        setResultadoPlanificador(resultado);
        setStatus('finalizado');
    }

    useEffect(() => {
        setPlanificador({
            ...planificador,
            procesos: procesos,
            politica: politicaInput,
            quantum: quantumInput,
            tip: tipInput,
            tfp: tfpInput,
            tcp: tcpInput,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        procesos,
        politicaInput,
        quantumInput,
        tipInput,
        tfpInput,
        tcpInput,
    ]);

    return (
        <>
            {status !== 'preparado' && (
                <>
                    <Grid container justifyContent={'left'} style={{ margin: '1rem' }}>
                        <Typography variant='h6' component='span'>
                            Planificador de procesos
                        </Typography>
                    </Grid>

                    <div style={{ margin: '1rem' }}>
                        <form onSubmit={ejecutarTanda}>
                            <Grid container spacing={2} justifyContent={'center'}>
                                <Grid item xs={12} md={politicaInput === 'rr' ? 8 : 12}>
                                    <FormControl fullWidth>
                                        <InputLabel id="politica_planificacion">Política de planificación</InputLabel>
                                        <Select
                                            labelId="politica_planificacion"
                                            id="demo-simple-select"
                                            value={politicaInput}
                                            label="Política de planificación"
                                            onChange={(event) => {
                                                if (['fcfs', 'rr', 'spn', 'srtn', 'pe'].includes(event.target.value)) {
                                                    setPoliticaInput(event.target.value as 'fcfs' | 'rr' | 'spn' | 'srtn' | 'pe');
                                                } else {
                                                    setPoliticaInput("fcfs");
                                                }
                                            }}
                                        >
                                            <MenuItem value={"fcfs"}>First Come First Served</MenuItem>
                                            <MenuItem value={"rr"}>Round Robin</MenuItem>
                                            <MenuItem value={"spn"}>Shortest Process Next</MenuItem>
                                            <MenuItem value={"srtn"}>Shortest Remaining Time Next</MenuItem>
                                            <MenuItem value={"pe"}>Prioridad Externa</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                {politicaInput === 'rr' && (
                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            type="number"
                                            id='quantum'
                                            name='quantum'
                                            label='Quantum'
                                            value={quantumInput}
                                            onChange={(event) => setQuantumInput(Number(event.target.value))}
                                            helperText={"Quantum para Round Robin"}
                                            fullWidth
                                            required
                                            autoComplete='off'
                                            autoFocus
                                        />
                                    </Grid>
                                )}
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        type="number"
                                        id='tip'
                                        name='tip'
                                        label='TIP'
                                        value={tipInput}
                                        onChange={(event) => setTipInput(Number(event.target.value))}
                                        helperText={"Tiempo que utiliza el sistema operativo para aceptar los nuevos procesos"}
                                        fullWidth
                                        required
                                        autoComplete='off'
                                        autoFocus
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        type="number"
                                        id='tfp'
                                        name='tfp'
                                        label='TFP'
                                        value={tfpInput}
                                        onChange={(event) => setTfpInput(Number(event.target.value))}
                                        helperText={"Tiempo que utiliza el sistema operativo para terminar los procesos"}
                                        fullWidth
                                        required
                                        autoComplete='off'
                                        autoFocus
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        type="number"
                                        id='tcp'
                                        name='tcp'
                                        label='TCP'
                                        value={tcpInput}
                                        onChange={(event) => setTcpInput(Number(event.target.value))}
                                        helperText={"Tiempo de conmutación entre procesos"}
                                        fullWidth
                                        required
                                        autoComplete='off'
                                        autoFocus
                                    />
                                </Grid>
                                <Grid item container xs={12} justifyContent={'center'} style={{ margin: '1rem' }}>
                                    <Button type="submit" variant="contained">Ejecutar Tanda</Button>
                                </Grid>
                            </Grid>
                        </form>
                        <p>{JSON.stringify(planificador)}</p>
                    </div>
                </>
            )}
        </>
    );
}