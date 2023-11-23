import './normalize.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './App.css';
import { NavBar } from './components/NavBar';
import { ProcesosInput } from './components/ProcesosInput';
import { ProcesosList } from './components/ProcesosList';
import { AppContextProvider } from './Context';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { PlanificadorForm } from './components/PlanificadorForm';
import { ResultadosPlanificador } from './components/ResultadosPlanificador';
import { SnackbarProvider } from 'notistack';
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from 'react';

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
  },
});

function App() {

  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <AppContextProvider>
        {/* Notistack provider */}
        <SnackbarProvider />

        {/* El AppContextProvider es el encargado de guardar el estado actual de la app */}
        <NavBar />
        <ProcesosInput />
        <ProcesosList />

        <PlanificadorForm />
        <hr style={{ width: '50%' }} data-aos="fade-up" />

        <ResultadosPlanificador />
        {/* ICONO EN EJECUCION 
        import RunningWithErrorsIcon from '@mui/icons-material/RunningWithErrors';
        <RunningWithErrorsIcon />
      */}
      </AppContextProvider>
    </ThemeProvider>
  );
}

export default App;
