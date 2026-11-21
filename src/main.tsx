import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
// Tipografías alojadas en la propia web (sin pedirlas a Google Fonts, que frenaba la primera carga)
import '@fontsource/bebas-neue/latin-400.css';
import '@fontsource/barlow-condensed/latin-600.css';
import '@fontsource/dm-sans/latin-300.css';
import '@fontsource/dm-sans/latin-400.css';
import './index.css';
import './i18n.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
