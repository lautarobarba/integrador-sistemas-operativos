// Strategy pattern

import { PlanificadorDeProcesos, ResultadoPlanificador } from '../interfaces';

export const ejecutarPlanificador = async (
  planificador: PlanificadorDeProcesos,
): Promise<ResultadoPlanificador> => {
  console.log('== Ejecutando planificador de procesos ==');
  console.log(planificador);

  const resultado: ResultadoPlanificador = {
    tiempo_retorno_tanda: 0,
    tiempo_medio_retorno_tanda: 0,
  } as ResultadoPlanificador;

  switch (planificador.politica) {
    // 'fcfs' | 'rr' | 'spn' | 'srtn' | 'pe';
    case 'fcfs':
      console.log('Ejecutando FCFS');
      resultado.tiempo_retorno_tanda = 1;
      resultado.tiempo_medio_retorno_tanda = 1;
      break;
    case 'rr':
      console.log('Ejecutando RR');
      resultado.tiempo_retorno_tanda = 1;
      resultado.tiempo_medio_retorno_tanda = 1;
      break;
    case 'spn':
      console.log('Ejecutando SPN');
      resultado.tiempo_retorno_tanda = 1;
      resultado.tiempo_medio_retorno_tanda = 1;
      break;
    case 'srtn':
      console.log('Ejecutando SRTN');
      resultado.tiempo_retorno_tanda = 1;
      resultado.tiempo_medio_retorno_tanda = 1;
      break;
    case 'pe':
      console.log('Ejecutando PE');
      resultado.tiempo_retorno_tanda = 1;
      resultado.tiempo_medio_retorno_tanda = 1;
      break;
    default:
      throw Error('Error en política seleccionada');
      break;
  }

  return resultado;
};
