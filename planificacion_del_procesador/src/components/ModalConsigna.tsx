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
            </DialogContent>

            <DialogActions>
                <Button autoFocus onClick={() => setShowModal(false)}>
                    Aceptar
                </Button>
            </DialogActions>
        </Dialog>
    );
}