import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import CloseIcon from '@mui/icons-material/Close';

type ModalConsignaProps = {
    showModal: boolean;
    setShowModal: Dispatch<SetStateAction<boolean>>
}

export const ModalConsigna = (props: ModalConsignaProps) => {
    const { showModal, setShowModal } = props;
    return (
        <Dialog
            onClose={() => setShowModal(false)}
            open={showModal}
            maxWidth={'lg'}
            fullWidth
        >
            <DialogTitle sx={{ m: 0, p: 2 }} textAlign={'center'}>
                SISTEMAS OPERATIVOS <br />
                TRABAJO PRÁCTICO DE IMPLEMENTACION Nº 1 <br />
                TPI-01-PP – PLANIFICACIÓN DEL PROCESADOR
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={() => setShowModal(false)}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            <hr style={{ width: '90%' }} />


            <DialogContent>
                <p style={{ marginBottom: 0, fontWeight: 'bold' }}>
                    Objetivo:
                </p>
                <p style={{ marginTop: '0.5rem' }}>
                    Se trata de programar un sistema que simule distintas estrategias de planificación del
                    procesador (dispatcher), y calcule un conjunto de indicadores que serán utilizados para discutir
                    las ventajas y desventajas de cada estrategia.
                </p>
                <p style={{ marginBottom: 0, fontWeight: 'bold' }}>
                    Características del sistema a simular:
                </p>
                <p style={{ marginTop: '0.5rem' }}>
                    Asuma que se trata de un sistema multiprogramado y monoprocesador.
                </p>
                <p style={{ marginBottom: 0 }}>
                    El simulador debe leer un archivo en el que cada registro tiene los siguientes datos:
                </p>
                <ul style={{ marginTop: '0.5rem' }}>
                    <li>nombre del proceso</li>
                    <li>tiempo de arribo</li>
                    <li>cantidad de ráfagas de CPU a emplear para terminar</li>
                    <li>duración de la ráfaga de CPU</li>
                    <li>duración de la ráfaga de entrada-salida entre ráfagas de CPU</li>
                    <li>prioridad externa</li>
                </ul>
                <p style={{ marginTop: '0.5rem', marginBottom: 0 }}>
                    Completada la lectura del archivo aceptará una entrada por teclado que indicará la política de
                    planificación a aplicar a la tanda. Como mínimo se deben permitir las siguientes opciones:
                </p>
                <ol style={{ marginTop: '0.5rem', listStyleType: 'upper-alpha' }}>
                    <li>FCFS (First Come First Served)</li>
                    <li>Prioridad Externa</li>
                    <li>Round-Robin</li>
                    <li>SPN (Shortest Process Next)</li>
                    <li>SRTN (Shortest Remaining Time Next)</li>
                </ol>
                <p style={{ marginTop: '0.5rem', marginBottom: 0 }}>
                    Finalmente permitirá introducir los siguientes datos:
                </p>
                <ul style={{ marginTop: '0.5rem' }}>
                    <li>Tiempo que utiliza el sistema operativo para aceptar los nuevos procesos (TIP)</li>
                    <li>Tiempo que utiliza el sistema operativo para terminar los procesos (TFP)</li>
                    <li>Tiempo de conmutación entre procesos (TCP)</li>
                    <li>Quantum (si fuera necesario)</li>
                </ul>
                <p style={{ marginTop: '0.5rem', marginBottom: 0 }}>
                    El simulador ejecutará la tanda hasta que se hayan completado la totalidad de los trabajos
                    produciendo las siguientes salidas:
                </p>
                <p style={{ marginTop: '0.5rem', marginBottom: 0 }}>
                    Un archivo en el que se indiquen todos los eventos que se producen en el sistema a lo largo
                    de la simulación y el tiempo en el que ocurren los mismos. Ejemplos de eventos: arriba un
                    trabajo, se incorpora un trabajo al sistema, se completa la ráfaga del proceso que se está
                    ejecutando, se agota el quantum, termina una operación de entrada-salida, se atiende una
                    interrupción de entrada-salida, termina un proceso.
                </p>
                <p style={{ marginTop: '0.5rem', marginBottom: 0 }}>
                    Al finalizar la simulación imprimirá y mostrará por pantalla –como mínimo– los siguientes
                    indicadores:
                </p>
                <ol style={{ marginTop: '0.5rem', listStyleType: 'upper-alpha' }}>
                    <li>Para cada proceso: Tiempo de Retorno, Tiempo de Retorno Normalizado,
                        Tiempo en Estado de Listo</li>
                    <li>Para la tanda de procesos: Tiempo de Retorno y Tiempo Medio de Retorno</li>
                    <li>Para el uso de la CPU: Tiempos de CPU desocupada, CPU utilizada por el
                        SO, CPU utilizada por los procesos (en tiempos absolutos y porcentuales)</li>
                </ol>
            </DialogContent>

            <DialogActions>
                <Button autoFocus onClick={() => setShowModal(false)}>
                    Aceptar
                </Button>
            </DialogActions>
        </Dialog>
    );
}