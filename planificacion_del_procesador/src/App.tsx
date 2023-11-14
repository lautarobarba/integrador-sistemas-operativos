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

function App() {
  return (
    <AppContextProvider>
      {/* El AppContextProvider es el encargado de guardar el estado actual de la app */}
      <NavBar />
      <ProcesosInput />
      <ProcesosList />
      {/* ICONO EN EJECUCION 
      import RunningWithErrorsIcon from '@mui/icons-material/RunningWithErrors';
      <RunningWithErrorsIcon />
       */}
    </AppContextProvider>
  );
}

export default App;
