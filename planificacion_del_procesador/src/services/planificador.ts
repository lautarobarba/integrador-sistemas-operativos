import {
  EstadoSistema,
  PlanificadorDeProcesos,
  Proceso,
  ProcesoEnEjecucion,
  ResultadoPlanificador,
} from '../interfaces';

const ejecutarUnTickCPU = (
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

const ejecutarUnTickIO = (
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

const ejecutarUnTickTIP = (
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

const ejecutarUnTickTCP = (
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

const ejecutarUnTickTFP = (
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

const ejecutarUnTickIDLE = (historial: EstadoSistema[], unidadDeTiempo: number) => {
  // console.log(`Ejecutando Tick IDLE`);
  historial.push({
    orden: unidadDeTiempo,
    tarea: 'esperando_idle',
  });
};

// Strategy pattern
interface EjecutorProcesosStrategy {
  planificador: PlanificadorDeProcesos;
  ejecutar: () => ResultadoPlanificador;
}

class EjecutorPE implements EjecutorProcesosStrategy {
  planificador: PlanificadorDeProcesos;
  unidadDeTiempo: number;
  colaListos: ProcesoEnEjecucion[];
  colaBloqueadosPorIO: ProcesoEnEjecucion[];
  ultimoProcesoEjecutadoID: number;
  resultado: ResultadoPlanificador;

  constructor(planificador: PlanificadorDeProcesos) {
    this.planificador = planificador;
    this.unidadDeTiempo = 0;
    this.colaListos = [];
    this.colaBloqueadosPorIO = [];
    this.ultimoProcesoEjecutadoID = -1;
    this.resultado = {
      historialEstados: [],
      procesosFinalizados: [],
      tiempoRetornoTanda: 0,
      tiempoMedioRetornoTanda: 0,
    } as ResultadoPlanificador;

    this.actualizarColaListos();
    this.actualizarColaBloqueadosPorIO();
  }

  avanzarUnaUnidadDeTiempo = () => {
    this.unidadDeTiempo = this.unidadDeTiempo + 1;
  };

  actualizarColaListos = () => {
    // Ordeno por prioridad externa.
    // Actualizo la colaDeProcesosPendientes para esta unidad de tiempo
    this.planificador.procesos
      // Primero filtro aquellos que arribaron en esta unidadDeTiempo
      .filter((proceso: Proceso) => proceso.tiempoDeArribo === this.unidadDeTiempo)
      // Luego creo los procesosEnejecucion para agregarlos a la cola
      .forEach((proceso: Proceso) => {
        this.colaListos.push({
          ...proceso,
          // Resto 1 a la cantidad de rafagas pendientes
          //  porque ya la estoy cargando en rafagaCPUPendienteEnEjecucion
          cantidadDeRafagasCPU:
            proceso.cantidadDeRafagasCPU > 0 ? proceso.cantidadDeRafagasCPU - 1 : 0,
          yaEjecutoSuTIP: this.planificador.tip === 0 ? true : false,
          rafagaCPUPendienteEnEjecucion: proceso.duracionRafagaCPU,
          rafagaIOPendienteEnEjecucion: proceso.duracionRafagaIO,
        });
      });
  };

  ordenarColaListos = () => {
    this.colaListos.sort(
      (procesoA: ProcesoEnEjecucion, procesoB: ProcesoEnEjecucion) =>
        procesoB.prioridad - procesoA.prioridad,
    );
  };

  actualizarColaBloqueadosPorIO = () => {
    // Para cada proceso en la cola de bloqueados
    //  ejecuto 1 tick de I/O y los que se completan se pasan
    //    a la cola de listos
    let procesosBloqueadosRevisados: number = 0;
    while (procesosBloqueadosRevisados < this.colaBloqueadosPorIO.length) {
      if (this.colaBloqueadosPorIO[procesosBloqueadosRevisados].rafagaIOPendienteEnEjecucion > 0) {
        ejecutarUnTickIO(
          this.colaBloqueadosPorIO[procesosBloqueadosRevisados],
          this.resultado.historialEstados,
          this.unidadDeTiempo,
        );
      }
      // Una vez que el proceso esta listo para ser ejecutado se pueden dar las siguientes situaciones:
      // Una vez que ejecute un tick de I/O sobre el proceso se pueden dar las siguientes situaciones:
      //  raf_io_pen > 0                      => El proceso continua bloqueado (no hago nada)
      //  raf_io_pen = 0 && cant_raf_io > 0   => Resto 1 a cant_raf_io y envio a cola de listos
      //  raf_io_pen = 0 && cant_raf_io = 0   => Envio a la cola de listos
      if (
        this.colaBloqueadosPorIO[procesosBloqueadosRevisados].rafagaIOPendienteEnEjecucion === 0
      ) {
        if (this.colaBloqueadosPorIO[procesosBloqueadosRevisados].cantidadDeRafagasIO > 0) {
          this.colaBloqueadosPorIO[procesosBloqueadosRevisados].cantidadDeRafagasIO =
            this.colaBloqueadosPorIO[procesosBloqueadosRevisados].cantidadDeRafagasIO - 1;
          this.colaBloqueadosPorIO[procesosBloqueadosRevisados].rafagaIOPendienteEnEjecucion =
            this.colaBloqueadosPorIO[procesosBloqueadosRevisados].duracionRafagaIO;
        }

        this.colaListos.push({ ...this.colaBloqueadosPorIO[procesosBloqueadosRevisados] });
        this.colaBloqueadosPorIO.splice(procesosBloqueadosRevisados, 1);
      } else {
        procesosBloqueadosRevisados = procesosBloqueadosRevisados + 1;
      }
    }
  };

  // Algoritmo de ejecución para política PE.
  public ejecutar = () => {
    // Ejecutar uno a uno sin interrupciones.
    let contador: number = 0;
    const habilitarCorte: boolean = true;
    while (
      this.resultado.procesosFinalizados.length < this.planificador.procesos.length &&
      contador < 100 &&
      habilitarCorte
    ) {
      contador = contador + 1;
      // Reviso si todavia no hay ningun proceso en la cola de listos y el procesador esta IDLE
      if (this.colaListos.length === 0) {
        // EL procesador esta en idle
        ejecutarUnTickIDLE(this.resultado.historialEstados, this.unidadDeTiempo);
        this.avanzarUnaUnidadDeTiempo();
        this.actualizarColaBloqueadosPorIO();
        this.actualizarColaListos();
        this.ordenarColaListos();
      } else {
        // Tomo el primer proceso de la cola de listos (Previamente ordenada segun politica seleccionada)
        // Reviso si el proceso actual es distinto al ultimo ejecutado
        //  de ser necesario realizo TIP o TCP segun corresponda
        console.log('probando tcp con:', this.ultimoProcesoEjecutadoID);
        if (
          this.ultimoProcesoEjecutadoID !== this.colaListos[0].id &&
          this.ultimoProcesoEjecutadoID != -1 &&
          this.colaListos[0].yaEjecutoSuTIP
        ) {
          // Corresponde realizar TCP
          for (let i = 0; i < this.planificador.tcp; i++) {
            ejecutarUnTickTCP(
              this.colaListos[0],
              this.resultado.historialEstados,
              this.unidadDeTiempo,
            );
            this.avanzarUnaUnidadDeTiempo();
            this.actualizarColaBloqueadosPorIO();
            this.actualizarColaListos();
          }
          this.ultimoProcesoEjecutadoID = this.colaListos[0].id;
          this.ordenarColaListos();
        } else if (
          this.ultimoProcesoEjecutadoID !== this.colaListos[0].id &&
          !this.colaListos[0].yaEjecutoSuTIP
        ) {
          // Corresponde realizar TIP
          for (let i = 0; i < this.planificador.tip; i++) {
            ejecutarUnTickTIP(
              this.colaListos[0],
              this.resultado.historialEstados,
              this.unidadDeTiempo,
            );
            this.avanzarUnaUnidadDeTiempo();
            this.actualizarColaBloqueadosPorIO();
            this.actualizarColaListos();
          }
          this.colaListos[0].yaEjecutoSuTIP = true;
          this.ultimoProcesoEjecutadoID = this.colaListos[0].id;
          this.ordenarColaListos();
        } else {
          // Una vez que el proceso esta listo para ser ejecutado se pueden dar las siguientes situaciones:
          //  raf_cpu_pen > 0 && cant_raf_cpu >= 0    => Ejecuto un tick de CPU
          //  raf_cpu_pen = 0 && cant_raf_cpu > 0     => Resto 1 a cant_raf_cpu y envio a cola bloqueados
          //  raf_cpu_pen = 0 && cant_raf_cpu = 0     => Finalizo el proceso

          // Tomo el primer proceso en la cola de pendientes y ejecuto un tick de CPU
          if (this.colaListos[0].rafagaCPUPendienteEnEjecucion > 0) {
            ejecutarUnTickCPU(
              this.colaListos[0],
              this.resultado.historialEstados,
              this.unidadDeTiempo,
            );
            this.ultimoProcesoEjecutadoID = this.colaListos[0].id;
            this.avanzarUnaUnidadDeTiempo();
            this.actualizarColaBloqueadosPorIO();
            this.actualizarColaListos();
          }

          if (
            this.colaListos[0].rafagaCPUPendienteEnEjecucion === 0 &&
            this.colaListos[0].cantidadDeRafagasCPU > 0
          ) {
            // Si completo rafaga de CPU en ejecucion y quedan rafagas I/O pendientes ejecuto un tick de I/O
            this.colaListos[0].cantidadDeRafagasCPU = this.colaListos[0].cantidadDeRafagasCPU - 1;
            this.colaListos[0].rafagaCPUPendienteEnEjecucion = this.colaListos[0].duracionRafagaCPU;
            // Paso el proceso a la cola de bloquados por I/O
            this.colaBloqueadosPorIO.push(this.colaListos[0]);
            this.colaListos.shift();
          } else if (
            this.colaListos[0].rafagaCPUPendienteEnEjecucion === 0 &&
            this.colaListos[0].cantidadDeRafagasCPU === 0
          ) {
            // Si termina la rafaga completa de ejecucion y no quedan rafagas pendientes
            //    entonces lo quito de la cola de pendientes para continuar con el siguiente proceso

            // Realizo TFP en caso de ser necesario
            for (let i = 0; i < this.planificador.tfp; i++) {
              ejecutarUnTickTFP(
                this.colaListos[0],
                this.resultado.historialEstados,
                this.unidadDeTiempo,
              );
              this.avanzarUnaUnidadDeTiempo();
              this.actualizarColaBloqueadosPorIO();
              this.actualizarColaListos();
            }

            // TODO: aca estoy quitando un proceso de la cola de pendients lo que significa que finalizo.
            //  tengo que ver como sacar un reporte de sus datos y agregarlo a la lista de procesosFinalizados
            this.resultado.procesosFinalizados.push({
              ...this.colaListos[0],
              tiempoRetorno: this.unidadDeTiempo - 1,
            });
            this.colaListos.shift();
          }
          this.ordenarColaListos();
        }
      }
    }

    return this.resultado;
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
