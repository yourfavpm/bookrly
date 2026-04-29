import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { useAppStore } from './store/useAppStore';

// Expose store for console debugging
(window as any).useAppStore = useAppStore;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
