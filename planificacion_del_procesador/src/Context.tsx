import { ReactNode, createContext, useState } from 'react';
import { PlanificadorDeProcesos, Proceso, ResultadoPlanificador } from './interfaces';

type AppContextType = {
  status: 'preparado' | 'cargado' | 'ejecutando' | 'finalizado';
  setStatus: (newValue: 'preparado' | 'cargado' | 'ejecutando' | 'finalizado') => void;
  procesos: Proceso[];
  setProcesos: (procesos: Proceso[]) => void;
  planificador: PlanificadorDeProcesos;
  setPlanificador: (planificador: PlanificadorDeProcesos) => void;
  resultadoPlanificador: ResultadoPlanificador;
  setResultadoPlanificador: (resultado: ResultadoPlanificador) => void;
};

export const AppContext = createContext<AppContextType>({
  status: 'preparado',
  setStatus: () => { },
  procesos: [],
  setProcesos: () => { },
  planificador: {
    politica: 'fcfs',
    procesos: [],
    tip: 0,
    tfp: 0,
    tcp: 0,
    quantum: 0,
  },
  setPlanificador: () => { },
  resultadoPlanificador: {
    historialEstados: [],
    procesosFinalizados: [],
    tiempoRetornoTanda: 0,
    tiempoMedioRetornoTanda: 0
  },
  setResultadoPlanificador: () => { },
});

type AppContextProviderProps = {
  children?: ReactNode;
};

export const AppContextProvider = (props: AppContextProviderProps) => {
  const { children } = props;
  const [status, setStatus] = useState<'preparado' | 'cargado' | 'ejecutando' | 'finalizado'>(
    'preparado',
  );
  const [procesos, setProcesos] = useState<Proceso[]>([]);
  const [planificador, setPlanificador] = useState<PlanificadorDeProcesos>({
    politica: 'fcfs',
    procesos: [],
    tip: 0,
    tfp: 0,
    tcp: 0,
    quantum: 0,
  });
  const [resultadoPlanificador, setResultadoPlanificador] = useState<ResultadoPlanificador>({
    historialEstados: [],
    procesosFinalizados: [],
    tiempoRetornoTanda: 0,
    tiempoMedioRetornoTanda: 0
  });

  return (
    <AppContext.Provider value={{
      status,
      setStatus,
      procesos,
      setProcesos,
      planificador,
      setPlanificador,
      resultadoPlanificador,
      setResultadoPlanificador,
    }}>
      {children}
    </AppContext.Provider>
  );
};
