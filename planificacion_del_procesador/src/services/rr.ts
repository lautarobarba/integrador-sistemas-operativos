import {
  PlanificadorDeProcesos,
  Proceso,
  ProcesoEnEjecucion,
  ProcesoFinalizado,
  ResultadoPlanificador,
} from '../interfaces';
import {
  EjecutorProcesosStrategy,
  ejecutarUnTickCPU,
  ejecutarUnTickIDLE,
  ejecutarUnTickIO,
  ejecutarUnTickTCP,
  ejecutarUnTickTFP,
  ejecutarUnTickTIP,
} from './common';

export class EjecutorRR implements EjecutorProcesosStrategy {
  planificador: PlanificadorDeProcesos;
  unidadDeTiempo: number;
  colaListos: ProcesoEnEjecucion[];
  colaBloqueadosPorIO: ProcesoEnEjecucion[];
  ultimoProcesoEjecutadoID: number;
  resultado: ResultadoPlanificador;
  quantumCounter: number;

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
      tiempoCPUDesocupada: 0,
      tiempoCPUConSO: 0,
    } as ResultadoPlanificador;
    this.quantumCounter = 1;
    this.actualizarColaBloqueadosPorIO();
    this.actualizarColaListos();
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
          tiempoServicio: 0,
          tiempoEsperaListo: 0,
        });
      });
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
    while (this.resultado.procesosFinalizados.length < this.planificador.procesos.length) {
      // Reviso si todavia no hay ningun proceso en la cola de listos y el procesador esta IDLE
      if (this.colaListos.length === 0) {
        // EL procesador esta en idle
        ejecutarUnTickIDLE(this.resultado.historialEstados, this.unidadDeTiempo);
        this.resultado.tiempoCPUDesocupada = this.resultado.tiempoCPUDesocupada + 1;
        this.avanzarUnaUnidadDeTiempo();
        this.actualizarColaBloqueadosPorIO();
        this.actualizarColaListos();
      } else {
        // Tomo el primer proceso de la cola de listos (Previamente ordenada segun politica seleccionada)
        // Reviso si el proceso actual es distinto al ultimo ejecutado
        //  de ser necesario realizo TIP o TCP segun corresponda
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
            this.resultado.tiempoCPUConSO = this.resultado.tiempoCPUConSO + 1;
            this.avanzarUnaUnidadDeTiempo();
            this.actualizarColaBloqueadosPorIO();
            this.actualizarColaListos();
          }
          this.ultimoProcesoEjecutadoID = this.colaListos[0].id;
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
            this.resultado.tiempoCPUConSO = this.resultado.tiempoCPUConSO + 1;
            this.avanzarUnaUnidadDeTiempo();
            this.actualizarColaBloqueadosPorIO();
            this.actualizarColaListos();
          }
          this.colaListos[0].yaEjecutoSuTIP = true;
          this.ultimoProcesoEjecutadoID = this.colaListos[0].id;
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

            // Actualizo ticks de servicios y espera en cola de listos
            this.colaListos[0].tiempoServicio = this.colaListos[0].tiempoServicio + 1;

            if (this.colaListos.length > 1) {
              for (let i = 1; i < this.colaListos.length; i++) {
                this.colaListos[i].tiempoEsperaListo = this.colaListos[i].tiempoEsperaListo + 1;
              }
            }

            this.ultimoProcesoEjecutadoID = this.colaListos[0].id;
            this.avanzarUnaUnidadDeTiempo();
            this.actualizarColaBloqueadosPorIO();
            this.actualizarColaListos();

            // Reviso si se completo el quantum de RR para pasar el proceso al final de la cola de listos
            if (this.quantumCounter % this.planificador.quantum == 0) {
              this.colaListos.push({ ...this.colaListos[0] });
              this.colaListos.shift();
            }
            this.quantumCounter = this.quantumCounter + 1;
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
            this.quantumCounter = 1;
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
              this.resultado.tiempoCPUConSO = this.resultado.tiempoCPUConSO + 1;
              this.avanzarUnaUnidadDeTiempo();
              this.actualizarColaBloqueadosPorIO();
              this.actualizarColaListos();
            }

            // TODO: aca estoy quitando un proceso de la cola de pendients lo que significa que finalizo.
            //  tengo que ver como sacar un reporte de sus datos y agregarlo a la lista de procesosFinalizados
            this.resultado.procesosFinalizados.push({
              ...this.colaListos[0],
              instanteRetorno: this.unidadDeTiempo,
              tiempoRetorno: this.unidadDeTiempo - this.colaListos[0].tiempoDeArribo,
              tiempoRetornoNormalizado:
                (this.unidadDeTiempo - this.colaListos[0].tiempoDeArribo) /
                this.colaListos[0].tiempoServicio,
            });
            this.colaListos.shift();
            this.quantumCounter = 1;
          }
        }
      }
    }

    this.resultado.procesosFinalizados.sort(
      (procesoA: ProcesoFinalizado, procesoB: ProcesoFinalizado) => procesoA.id - procesoB.id,
    );
    this.resultado.tiempoRetornoTanda = this.unidadDeTiempo;
    return this.resultado;
  };
}
