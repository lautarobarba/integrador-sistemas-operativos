import { ReactNode, createContext, useState } from 'react';
import { PlanificadorDeProcesos, Proceso } from './interfaces';

type AppContextType = {
  procesos: Proceso[];
  setProcesos: (procesos: Proceso[]) => void;
  planificador: PlanificadorDeProcesos;
  setPlanificador: (planificador: PlanificadorDeProcesos) => void;
  status: 'preparado' | 'cargado' | 'ejecutando' | 'finalizado';
  setStatus: (newValue: 'preparado' | 'cargado' | 'ejecutando' | 'finalizado') => void;
};

export const AppContext = createContext<AppContextType>({
  procesos: [],
  setProcesos: () => { },
  planificador: {
    politica: 'fcfs',
    procesos: [],
    tip: 0,
    tfp: 0,
    tcp: 0,
    quantum: 0,
    tiempo_retorno_tanda: 0,
    tiempo_medio_retorno_tanda: 0
  },
  setPlanificador: () => { },
  status: 'preparado',
  setStatus: () => { },
});

type AppContextProviderProps = {
  children?: ReactNode;
};

export const AppContextProvider = (props: AppContextProviderProps) => {
  const { children } = props;
  const [procesos, setProcesos] = useState<Proceso[]>([]);
  const [planificador, setPlanificador] = useState<PlanificadorDeProcesos>({
    politica: 'fcfs',
    procesos: [],
    tip: 0,
    tfp: 0,
    tcp: 0,
    quantum: 0,
    tiempo_retorno_tanda: 0,
    tiempo_medio_retorno_tanda: 0
  });
  const [status, setStatus] = useState<'preparado' | 'cargado' | 'ejecutando' | 'finalizado'>(
    'preparado',
  );

  return (
    <AppContext.Provider value={{ procesos, setProcesos, planificador, setPlanificador, status, setStatus }}>
      {children}
    </AppContext.Provider>
  );
};
