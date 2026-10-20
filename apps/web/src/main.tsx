import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource-variable/bricolage-grotesque';
import '@fontsource-variable/source-serif-4';
import '@fontsource-variable/jetbrains-mono';
import './estilos.css';
import { App } from './App';
import { ProveedorProgreso } from './lib/progreso';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ProveedorProgreso>
        <App />
      </ProveedorProgreso>
    </BrowserRouter>
  </StrictMode>,
);
