import { ReactNode, createContext, useState } from 'react';
import { Proceso } from './interfaces/Proceso.interface';

type AppContextType = {
  procesos: Proceso[];
  status: 'preparado' | 'cargado' | 'ejecutando' | 'finalizado';
  setStatus: (newValue: 'preparado' | 'cargado' | 'ejecutando' | 'finalizado') => void;
  cargarProcesos: (procesos: Proceso[]) => void;
};

export const AppContext = createContext<AppContextType>({
  procesos: [],
  status: 'preparado',
  setStatus: () => { },
  cargarProcesos: () => { },
});

type AppContextProviderProps = {
  children?: ReactNode;
};

export const AppContextProvider = (props: AppContextProviderProps) => {
  const { children } = props;
  const [procesos, setProcesos] = useState<Proceso[]>([]);
  const [status, setStatus] = useState<'preparado' | 'cargado' | 'ejecutando' | 'finalizado'>(
    'preparado',
  );

  const cargarProcesos = (procesos: Proceso[]) => {
    setProcesos(procesos);
    setStatus('cargado');
  };

  return (
    <AppContext.Provider value={{ procesos, status, setStatus, cargarProcesos }}>
      {children}
    </AppContext.Provider>
  );
};
