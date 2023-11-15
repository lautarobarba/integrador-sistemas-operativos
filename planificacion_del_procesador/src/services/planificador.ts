import {
  EstadoSistema,
  PlanificadorDeProcesos,
  Proceso,
  ResultadoPlanificador,
} from '../interfaces';

type ProcesoEnEjecucion = Proceso & {
  rafagaCPUPendienteEnEjecucion: number;
  rafagaIOPendienteEnEjecucion: number;
};

const ejecutarUnTickCPU = (proceso: ProcesoEnEjecucion, historial: EstadoSistema[]) => {
  console.log(`Ejecutando Tick de CPU para proceso: ${proceso.nombre}`);
  proceso.rafagaCPUPendienteEnEjecucion = proceso.rafagaCPUPendienteEnEjecucion - 1;
  historial.push({
    orden: historial.length + 1,
    tarea: 'ejecutando_cpu',
    procesoID: proceso.id,
    procesoNombre: proceso.nombre,
  });
};

const ejecutarUnTickIO = (proceso: ProcesoEnEjecucion, historial: EstadoSistema[]) => {
  console.log(`Ejecutando Tick de I/O para proceso: ${proceso.nombre}`);
  proceso.rafagaIOPendienteEnEjecucion = proceso.rafagaIOPendienteEnEjecucion - 1;
  historial.push({
    orden: historial.length + 1,
    tarea: 'esperando_io',
    procesoID: proceso.id,
    procesoNombre: proceso.nombre,
  });
};

// const ejecutarUnTickIDLE = (historial: EstadoSistema[]) => {
//   console.log(`Ejecutando Tick IDLE`);
//   historial.push({
//     orden: historial.length + 1,
//     tarea: 'esperando_idle',
//   });
// };

// Strategy pattern
interface EjecutorProcesosStrategy {
  planificador: PlanificadorDeProcesos;
  ejecutar: () => ResultadoPlanificador;
}

class EjecutorPE implements EjecutorProcesosStrategy {
  planificador: PlanificadorDeProcesos;
  unidadDeTiempo: number;

  constructor(planificador: PlanificadorDeProcesos) {
    this.planificador = planificador;
    this.unidadDeTiempo = 0;
  }

  public ejecutar = () => {
    const resultado: ResultadoPlanificador = {
      historialEstados: [],
      procesosFinalizados: [],
      tiempoRetornoTanda: 0,
      tiempoMedioRetornoTanda: 0,
    } as ResultadoPlanificador;

    // Algoritmo de ejecución para política PE.
    // Ordeno por prioridad externa.
    const colaPendientes: ProcesoEnEjecucion[] = [];
    // Actualizo la colaDeProcesosPendientes para esta unidad de tiempo
    // Primero filtro aquellos que arribaron en esta unidadDeTiempo
    this.planificador.procesos
      .filter((proceso: Proceso) => proceso.tiempoDeArribo === this.unidadDeTiempo)
      // Luego creo los procesosEnejecucion para agregarlos a la cola
      .forEach((proceso: Proceso) => {
        colaPendientes.push({
          ...proceso,
          rafagaCPUPendienteEnEjecucion: proceso.duracionRafagaCPU,
          rafagaIOPendienteEnEjecucion: proceso.duracionRafagaIO,
        });
      });
    colaPendientes.sort(
      (procesoA: ProcesoEnEjecucion, procesoB: ProcesoEnEjecucion) =>
        procesoB.prioridad - procesoA.prioridad,
    );

    // Ejecutar uno a uno sin interrupciones.
    while (colaPendientes.length > 0) {
      // Tomo el primer proceso en la cola de pendientes y ejecuto un tick de CPU
      if (colaPendientes[0].rafagaCPUPendienteEnEjecucion > 0) {
        ejecutarUnTickCPU(colaPendientes[0], resultado.historialEstados);
      }

      // Si completo rafaga de CPU en ejecucion y quedan rafagas I/O pendientes ejecuto un tick de I/O
      if (
        colaPendientes[0].rafagaCPUPendienteEnEjecucion === 0 &&
        colaPendientes[0].rafagaIOPendienteEnEjecucion > 0
      ) {
        ejecutarUnTickIO(colaPendientes[0], resultado.historialEstados);
      }

      // Si completo rafaga de CPU en ejecucion y rafaga de I/O en ejecucion
      //    entonces descuento de la cantidad de rafagas totales
      //    y actualizo las rafagas pendientes de ejecucion
      if (
        colaPendientes[0].rafagaCPUPendienteEnEjecucion === 0 &&
        colaPendientes[0].rafagaIOPendienteEnEjecucion === 0 &&
        colaPendientes[0].cantidadDeRafagas > 0
      ) {
        colaPendientes[0].cantidadDeRafagas = colaPendientes[0].cantidadDeRafagas - 1;
        // Si falta ejecutar una rafaga completa actualizo los ticks pendients
        if (colaPendientes[0].cantidadDeRafagas > 0) {
          colaPendientes[0].rafagaCPUPendienteEnEjecucion = colaPendientes[0].duracionRafagaCPU;
          colaPendientes[0].rafagaIOPendienteEnEjecucion = colaPendientes[0].duracionRafagaIO;
        }
      }

      // Si completo la rafaga completa de ejecucion y no quedan rafagas pendientes
      //    entonces lo quito de la cola de pendientes para continuar con el siguiente proceso
      if (
        colaPendientes[0].rafagaCPUPendienteEnEjecucion === 0 &&
        colaPendientes[0].rafagaIOPendienteEnEjecucion === 0 &&
        colaPendientes[0].cantidadDeRafagas === 0
      ) {
        colaPendientes.shift();
      }

      this.unidadDeTiempo = this.unidadDeTiempo + 1;
      // Actualizo la colaDeProcesosPendientes para esta unidad de tiempo
      // Primero filtro aquellos que arribaron en esta unidadDeTiempo
      this.planificador.procesos
        .filter((proceso: Proceso) => proceso.tiempoDeArribo === this.unidadDeTiempo)
        // Luego creo los procesosEnejecucion para agregarlos a la cola
        .forEach((proceso: Proceso) => {
          colaPendientes.push({
            ...proceso,
            rafagaCPUPendienteEnEjecucion: proceso.duracionRafagaCPU,
            rafagaIOPendienteEnEjecucion: proceso.duracionRafagaIO,
          });
        });
      colaPendientes.sort(
        (procesoA: ProcesoEnEjecucion, procesoB: ProcesoEnEjecucion) =>
          procesoB.prioridad - procesoA.prioridad,
      );
    }

    return resultado;
  };
}

export const ejecutarPlanificacion = async (
  planificador: PlanificadorDeProcesos,
): Promise<ResultadoPlanificador> => {
  let ejecutorProcesos: EjecutorProcesosStrategy;
  switch (planificador.politica) {
    // 'fcfs' | 'rr' | 'spn' | 'srtn' | 'pe';
    // case 'fcfs':
    //   console.log('Ejecutando FCFS');
    //   resultado.tiempo_retorno_tanda = 1;
    //   resultado.tiempo_medio_retorno_tanda = 1;
    //   break;
    // case 'rr':
    //   console.log('Ejecutando RR');
    //   resultado.tiempo_retorno_tanda = 1;
    //   resultado.tiempo_medio_retorno_tanda = 1;
    //   break;
    // case 'spn':
    //   console.log('Ejecutando SPN');
    //   resultado.tiempo_retorno_tanda = 1;
    //   resultado.tiempo_medio_retorno_tanda = 1;
    //   break;
    // case 'srtn':
    //   console.log('Ejecutando SRTN');
    //   resultado.tiempo_retorno_tanda = 1;
    //   resultado.tiempo_medio_retorno_tanda = 1;
    //   break;
    case 'pe':
      console.log('== Ejecutando planificador de procesos (política PE) ==');
      ejecutorProcesos = new EjecutorPE(planificador);
      break;
    default:
      throw Error('Error en política seleccionada - Falta implementación');
      break;
  }

  console.log({ planificador });
  return ejecutorProcesos.ejecutar();
};
