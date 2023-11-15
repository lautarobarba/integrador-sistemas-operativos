export type Proceso = {
  id: number;
  nombre: string;
  tiempoDeArribo: number;
  cantidadDeRafagas: number;
  duracionRafagaCPU: number;
  duracionRafagaIO: number;
  prioridad: number;
};

export type PlanificadorDeProcesos = {
  // a) FCFS (First Come First Served)
  // b) Prioridad Externa
  // c) Round-Robin
  // d) SPN (Shortest Process Next)
  // e) SRTN (Shortest Remaining Time Next)
  politica: 'fcfs' | 'rr' | 'spn' | 'srtn' | 'pe';
  procesos: Proceso[];
  /* - Tiempo que utiliza el sistema operativo para aceptar los nuevos procesos (TIP) */
  tip: number;
  /* - Tiempo que utiliza el sistema operativo para terminar los procesos (TFP) */
  tfp: number;
  /* - Tiempo de conmutación entre procesos (TCP) */
  tcp: number;
  /* - Quantum (si fuera necesario) */
  quantum: number;
};

export type EstadoSistema = {
  orden: number;
  tarea:
    | 'ejecutando_cpu'
    | 'esperando_io'
    | 'esperando_idle'
    | 'ejecutando_tip'
    | 'ejecutando_tcp'
    | 'ejecutando_tfp';
  procesoID?: number;
  procesoNombre?: string;
};

export type ProcesoEnEjecucion = Proceso & {
  yaEjecutoSuTIP: boolean;
  rafagaCPUPendienteEnEjecucion: number;
  rafagaIOPendienteEnEjecucion: number;
};

export type ProcesoFinalizado = ProcesoEnEjecucion & {
  tiempoRetorno: number;
  //TODO:faltan mas datos del proceso finalizado
};

export type ResultadoPlanificador = {
  // Historial de estados para graficar
  historialEstados: EstadoSistema[];
  // Estado (Resultados) de cada proceso
  procesosFinalizados: ProcesoFinalizado[];
  // Estado (Resultados) de la tanda
  tiempoRetornoTanda: number;
  tiempoMedioRetornoTanda: number;
};
