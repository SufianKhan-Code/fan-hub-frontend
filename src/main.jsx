import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { UiProvider } from './context/UiContext';
import './styles/index.css';
import './styles/full-black-theme.css';
import './styles/responsive-overhaul.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <UiProvider>
        <AuthProvider><App/></AuthProvider>
      </UiProvider>
    </BrowserRouter>
  </React.StrictMode>
);
