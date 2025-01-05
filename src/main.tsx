import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './style/tailwind.css';
import App from './App.tsx';
import './style/table.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
