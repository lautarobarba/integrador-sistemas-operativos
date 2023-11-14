import { ReactNode, createContext, useState } from 'react';
import { Proceso } from './interfaces/Proceso.interface';

type AppContextType = {
  procesos: Proceso[];
  status: 'iniciado' | 'cargado' | 'ejecutando' | 'finalizado';
  //   setProcesos: (newValue: "light" | "dark") => void;
  //   setProcesos: () => void;
};

export const AppContext = createContext<AppContextType>({
  procesos: [],
  status: 'iniciado',
  //   setProcesos: () => {},
});

type AppContextProviderProps = {
  children?: ReactNode;
};

export const AppContextProvider = (props: AppContextProviderProps) => {
  const { children } = props;
  const [procesos, setProcesos] = useState<Proceso[]>([]);
  const [status, setStatus] = useState<'iniciado' | 'cargado' | 'ejecutando' | 'finalizado'>(
    'iniciado',
  );

  //   const setProcesos = () => {
  // const newValue: 'light' | 'dark' = theme === 'light' ? 'dark' : 'light';
  // setTheme(newValue);
  // localStorage.setItem('theme', newValue);
  //   };

  //   const changeTheme = (newValue: 'light' | 'dark') => {
  //     setTheme(newValue);
  //     localStorage.setItem('theme', newValue);
  //   };

  return <AppContext.Provider value={{ procesos, status }}>{children}</AppContext.Provider>;
};
