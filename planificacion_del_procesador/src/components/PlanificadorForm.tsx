import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../Context";
import { ejecutarPlanificacion } from "../services/planificador";
import { ResultadoPlanificador } from "../interfaces";
import { enqueueSnackbar } from "notistack";

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
        try {
            const resultado: ResultadoPlanificador = await ejecutarPlanificacion(planificador);
            setResultadoPlanificador(resultado);
            setStatus('finalizado');
            enqueueSnackbar('¡Tanda de procesos ejecutada!', {
                anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
                variant: 'success',
            });
        } catch (e) {
            setResultadoPlanificador({
                historialEstados: [],
                procesosFinalizados: [],
                tiempoRetornoTanda: 0,
                tiempoMedioRetornoTanda: 0,
                tiempoCPUConSO: 0,
                tiempoCPUDesocupada: 0,
            } as ResultadoPlanificador);
            setStatus('cargado');
            enqueueSnackbar('Error: no se pudo ejecutar la tanda...', {
                anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
                variant: 'error',
            });
            console.log(e);
        }
    }

    const resetResultados = () => {
        setResultadoPlanificador({
            historialEstados: [],
            procesosFinalizados: [],
            tiempoRetornoTanda: 0,
            tiempoMedioRetornoTanda: 0,
            tiempoCPUConSO: 0,
            tiempoCPUDesocupada: 0,
        } as ResultadoPlanificador);
        setStatus('cargado');
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
                                                resetResultados();
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
                                            onChange={(event) => {
                                                setQuantumInput(Number(event.target.value));
                                                resetResultados();
                                            }}
                                            error={quantumInput < 0}
                                            helperText={quantumInput < 0
                                                ? "Por favor ingrese un valor >= 0"
                                                : "Quantum para Round Robin"
                                            }
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
                                        onChange={(event) => {
                                            setTipInput(Number(event.target.value));
                                            resetResultados();
                                        }}
                                        error={tipInput < 0}
                                        helperText={tipInput < 0
                                            ? "Por favor ingrese un valor >= 0"
                                            : "Tiempo que utiliza el sistema operativo para aceptar los nuevos procesos"
                                        }
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
                                        onChange={(event) => {
                                            setTcpInput(Number(event.target.value));
                                            resetResultados();
                                        }}
                                        error={tcpInput < 0}
                                        helperText={tcpInput < 0
                                            ? "Por favor ingrese un valor >= 0"
                                            : "Tiempo de conmutación entre procesos"
                                        }
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
                                        onChange={(event) => {
                                            setTfpInput(Number(event.target.value));
                                            resetResultados();
                                        }}
                                        error={tfpInput < 0}
                                        helperText={tfpInput < 0
                                            ? "Por favor ingrese un valor >= 0"
                                            : "Tiempo que utiliza el sistema operativo para terminar los procesos"
                                        }
                                        fullWidth
                                        required
                                        autoComplete='off'
                                        autoFocus
                                    />
                                </Grid>
                                <Grid item container xs={12} justifyContent={'center'} style={{ margin: '1rem' }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={
                                            (tipInput < 0) ||
                                            (tfpInput < 0) ||
                                            (tcpInput < 0) ||
                                            (politicaInput === 'rr' && quantumInput < 0)
                                        }
                                    >Ejecutar Tanda</Button>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                </>
            )}
        </>
    );
}