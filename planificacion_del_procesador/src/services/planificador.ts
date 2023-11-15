import {
  EstadoSistema,
  PlanificadorDeProcesos,
  Proceso,
  ResultadoPlanificador,
} from '../interfaces';

type ProcesoEnEjecucion = Proceso & {
  yaEjecutoSuTIP: boolean;
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

const ejecutarUnTickTIP = (proceso: ProcesoEnEjecucion, historial: EstadoSistema[]) => {
  console.log(`Ejecutando Tick TIP para proceso: ${proceso.nombre}`);
  historial.push({
    orden: historial.length + 1,
    tarea: 'ejecutando_tip',
    procesoID: proceso.id,
    procesoNombre: proceso.nombre,
  });
};

const ejecutarUnTickTCP = (proceso: ProcesoEnEjecucion, historial: EstadoSistema[]) => {
  console.log(`Ejecutando Tick TFP para proceso: ${proceso.nombre}`);
  historial.push({
    orden: historial.length + 1,
    tarea: 'ejecutando_tcp',
    procesoID: proceso.id,
    procesoNombre: proceso.nombre,
  });
};

const ejecutarUnTickTFP = (proceso: ProcesoEnEjecucion, historial: EstadoSistema[]) => {
  console.log(`Ejecutando Tick TFP para proceso: ${proceso.nombre}`);
  historial.push({
    orden: historial.length + 1,
    tarea: 'ejecutando_tfp',
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
  ultimoProcesoEjecutadoID: number;
  colaPendientes: ProcesoEnEjecucion[];

  constructor(planificador: PlanificadorDeProcesos) {
    this.planificador = planificador;
    this.unidadDeTiempo = 0;
    this.ultimoProcesoEjecutadoID = -1;
    this.colaPendientes = [];
  }

  avanzarUnaUnidadDeTiempo = () => {
    this.unidadDeTiempo = this.unidadDeTiempo + 1;
  };

  actualizarColaPendientes = () => {
    // Ordeno por prioridad externa.
    // Actualizo la colaDeProcesosPendientes para esta unidad de tiempo
    this.planificador.procesos
      // Primero filtro aquellos que arribaron en esta unidadDeTiempo
      .filter((proceso: Proceso) => proceso.tiempoDeArribo === this.unidadDeTiempo)
      // Luego creo los procesosEnejecucion para agregarlos a la cola
      .forEach((proceso: Proceso) => {
        this.colaPendientes.push({
          ...proceso,
          yaEjecutoSuTIP: false,
          rafagaCPUPendienteEnEjecucion: proceso.duracionRafagaCPU,
          rafagaIOPendienteEnEjecucion: proceso.duracionRafagaIO,
        });
      });
    this.colaPendientes.sort(
      (procesoA: ProcesoEnEjecucion, procesoB: ProcesoEnEjecucion) =>
        procesoB.prioridad - procesoA.prioridad,
    );
  };

  // Algoritmo de ejecución para política PE.
  public ejecutar = () => {
    const resultado: ResultadoPlanificador = {
      historialEstados: [],
      procesosFinalizados: [],
      tiempoRetornoTanda: 0,
      tiempoMedioRetornoTanda: 0,
    } as ResultadoPlanificador;

    // Ejecutar uno a uno sin interrupciones.
    this.actualizarColaPendientes();
    while (this.colaPendientes.length > 0) {
      // Reviso si el proceso actual es distinto al ultimo ejecutado
      //  de ser necesario realizo TIP o TCP segun corresponda
      if (
        this.ultimoProcesoEjecutadoID !== this.colaPendientes[0].id &&
        this.colaPendientes[0].yaEjecutoSuTIP
      ) {
        // Corresponde realizar TCP
        for (let i = 0; i < this.planificador.tcp; i++) {
          ejecutarUnTickTCP(this.colaPendientes[0], resultado.historialEstados);
          this.avanzarUnaUnidadDeTiempo();
          this.actualizarColaPendientes();
        }
        this.ultimoProcesoEjecutadoID = this.colaPendientes[0].id;
      }
      if (
        this.ultimoProcesoEjecutadoID !== this.colaPendientes[0].id &&
        !this.colaPendientes[0].yaEjecutoSuTIP
      ) {
        // Corresponde realizar TIP
        for (let i = 0; i < this.planificador.tip; i++) {
          ejecutarUnTickTIP(this.colaPendientes[0], resultado.historialEstados);
          this.avanzarUnaUnidadDeTiempo();
          this.actualizarColaPendientes();
        }
        this.colaPendientes[0].yaEjecutoSuTIP = true;
        this.ultimoProcesoEjecutadoID = this.colaPendientes[0].id;
      }

      // Tomo el primer proceso en la cola de pendientes y ejecuto un tick de CPU
      if (this.colaPendientes[0].rafagaCPUPendienteEnEjecucion > 0) {
        ejecutarUnTickCPU(this.colaPendientes[0], resultado.historialEstados);
        this.avanzarUnaUnidadDeTiempo();
        this.actualizarColaPendientes();
      }

      // Si completo rafaga de CPU en ejecucion y quedan rafagas I/O pendientes ejecuto un tick de I/O
      if (
        this.colaPendientes[0].rafagaCPUPendienteEnEjecucion === 0 &&
        this.colaPendientes[0].rafagaIOPendienteEnEjecucion > 0
      ) {
        ejecutarUnTickIO(this.colaPendientes[0], resultado.historialEstados);
        this.avanzarUnaUnidadDeTiempo();
        this.actualizarColaPendientes();
      }

      // Si completo rafaga de CPU en ejecucion y rafaga de I/O en ejecucion
      //    entonces descuento de la cantidad de rafagas totales
      //    y actualizo las rafagas pendientes de ejecucion
      if (
        this.colaPendientes[0].rafagaCPUPendienteEnEjecucion === 0 &&
        this.colaPendientes[0].rafagaIOPendienteEnEjecucion === 0 &&
        this.colaPendientes[0].cantidadDeRafagas > 0
      ) {
        this.colaPendientes[0].cantidadDeRafagas = this.colaPendientes[0].cantidadDeRafagas - 1;
        // Si falta ejecutar una rafaga completa actualizo los ticks pendients
        if (this.colaPendientes[0].cantidadDeRafagas > 0) {
          this.colaPendientes[0].rafagaCPUPendienteEnEjecucion =
            this.colaPendientes[0].duracionRafagaCPU;
          this.colaPendientes[0].rafagaIOPendienteEnEjecucion =
            this.colaPendientes[0].duracionRafagaIO;
        }
      }

      // Si completo la rafaga completa de ejecucion y no quedan rafagas pendientes
      //    entonces lo quito de la cola de pendientes para continuar con el siguiente proceso
      if (
        this.colaPendientes[0].rafagaCPUPendienteEnEjecucion === 0 &&
        this.colaPendientes[0].rafagaIOPendienteEnEjecucion === 0 &&
        this.colaPendientes[0].cantidadDeRafagas === 0
      ) {
        // TODO: aca estoy quitando un proceso de la cola de pendients lo que significa que finalizo.
        //  tengo que ver como sacar un reporte de sus datos y agregarlo a la lista de procesosFinalizados

        // Realizo TFP en caso de ser necesario
        for (let i = 0; i < this.planificador.tfp; i++) {
          ejecutarUnTickTFP(this.colaPendientes[0], resultado.historialEstados);
          this.avanzarUnaUnidadDeTiempo();
          this.actualizarColaPendientes();
        }

        this.colaPendientes.shift();
      }

      this.avanzarUnaUnidadDeTiempo();
      this.actualizarColaPendientes();
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
