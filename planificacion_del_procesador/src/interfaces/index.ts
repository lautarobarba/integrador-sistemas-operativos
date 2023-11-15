export type Proceso = {
  id: number | string;
  nombre: string;
  tiempo_de_arribo: number;
  cantidad_de_rafagas: number;
  duracion_rafaga_cpu: number;
  duracion_rafaga_io: number;
  prioridad: number | string;
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

export type ResultadoPlanificador = {
  // Estado (Resultados) de la tanda
  tiempo_retorno_tanda: number;
  tiempo_medio_retorno_tanda: number;
};
