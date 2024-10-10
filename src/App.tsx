import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { Router } from './Router/router';
import { AlertProvider } from './Contexts/alertContext';

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
