import {
  EstadoSistema,
  PlanificadorDeProcesos,
  ProcesoEnEjecucion,
  ResultadoPlanificador,
} from '../interfaces';

// Strategy pattern
export interface EjecutorProcesosStrategy {
  planificador: PlanificadorDeProcesos;
  ejecutar: () => ResultadoPlanificador;
}

export const ejecutarUnTickCPU = (
  proceso: ProcesoEnEjecucion,
  historial: EstadoSistema[],
  unidadDeTiempo: number,
) => {
  // console.log(`Ejecutando Tick de CPU para proceso: ${proceso.nombre}`);
  proceso.rafagaCPUPendienteEnEjecucion = proceso.rafagaCPUPendienteEnEjecucion - 1;
  historial.push({
    orden: unidadDeTiempo,
    tarea: 'ejecutando_cpu',
    procesoID: proceso.id,
    procesoNombre: proceso.nombre,
  });
};

export const ejecutarUnTickIO = (
  proceso: ProcesoEnEjecucion,
  historial: EstadoSistema[],
  unidadDeTiempo: number,
) => {
  // console.log(`Ejecutando Tick de I/O para proceso: ${proceso.nombre}`);
  proceso.rafagaIOPendienteEnEjecucion = proceso.rafagaIOPendienteEnEjecucion - 1;
  historial.push({
    orden: unidadDeTiempo - 1,
    tarea: 'esperando_io',
    procesoID: proceso.id,
    procesoNombre: proceso.nombre,
  });
};

export const ejecutarUnTickTIP = (
  proceso: ProcesoEnEjecucion,
  historial: EstadoSistema[],
  unidadDeTiempo: number,
) => {
  // console.log(`Ejecutando Tick TIP para proceso: ${proceso.nombre}`);
  historial.push({
    orden: unidadDeTiempo,
    tarea: 'ejecutando_tip',
    procesoID: proceso.id,
    procesoNombre: proceso.nombre,
  });
};

export const ejecutarUnTickTCP = (
  proceso: ProcesoEnEjecucion,
  historial: EstadoSistema[],
  unidadDeTiempo: number,
) => {
  // console.log(`Ejecutando Tick TFP para proceso: ${proceso.nombre}`);
  historial.push({
    orden: unidadDeTiempo,
    tarea: 'ejecutando_tcp',
    procesoID: proceso.id,
    procesoNombre: proceso.nombre,
  });
};

export const ejecutarUnTickTFP = (
  proceso: ProcesoEnEjecucion,
  historial: EstadoSistema[],
  unidadDeTiempo: number,
) => {
  // console.log(`Ejecutando Tick TFP para proceso: ${proceso.nombre}`);
  historial.push({
    orden: unidadDeTiempo,
    tarea: 'ejecutando_tfp',
    procesoID: proceso.id,
    procesoNombre: proceso.nombre,
  });
};

export const ejecutarUnTickIDLE = (historial: EstadoSistema[], unidadDeTiempo: number) => {
  // console.log(`Ejecutando Tick IDLE`);
  historial.push({
    orden: unidadDeTiempo,
    tarea: 'esperando_idle',
  });
};
