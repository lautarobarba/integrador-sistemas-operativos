import { PlanificadorDeProcesos, ResultadoPlanificador } from '../interfaces';
import { EjecutorProcesosStrategy } from './common';
import { EjecutorFCFS } from './fcfs';
import { EjecutorPE } from './pe';
import { EjecutorRR } from './rr';
import { EjecutorSPN } from './spn';
import { EjecutorSRTN } from './srtn';

export const ejecutarPlanificacion = async (
  planificador: PlanificadorDeProcesos,
): Promise<ResultadoPlanificador> => {
  let ejecutorProcesos: EjecutorProcesosStrategy;
  switch (planificador.politica) {
    // 'fcfs' | 'rr' | 'spn' | 'srtn' | 'pe';
    case 'fcfs':
      console.log('== Ejecutando planificador de procesos (política FSFC) ==');
      ejecutorProcesos = new EjecutorFCFS(planificador);
      break;
    case 'rr':
      console.log('== Ejecutando planificador de procesos (política RR) ==');
      ejecutorProcesos = new EjecutorRR(planificador);
      break;
    case 'spn':
      console.log('== Ejecutando planificador de procesos (política SPN) ==');
      ejecutorProcesos = new EjecutorSPN(planificador);
      break;
    case 'srtn':
      console.log('== Ejecutando planificador de procesos (política SRTN) ==');
      ejecutorProcesos = new EjecutorSRTN(planificador);
      break;
    case 'pe':
      console.log('== Ejecutando planificador de procesos (política PE) ==');
      ejecutorProcesos = new EjecutorPE(planificador);
      break;
    default:
      throw Error('Error en política seleccionada - Falta implementación');
  }

  console.log({ planificador });
  return ejecutorProcesos.ejecutar();
};
