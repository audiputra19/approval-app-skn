import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { AlertProvider } from './Contexts/alertContext';
import { Router } from './Router/router';

function App() {
  return (
    <AlertProvider>
      <BrowserRouter>
        <Router/>
      </BrowserRouter>
    </AlertProvider>
  );
}

export default App;
