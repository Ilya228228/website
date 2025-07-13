import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/main.css';
import './styles/modal.css';
import App from './App';
import { ModalProvider } from './components/common/ModalManager';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ModalProvider>
      <App />
    </ModalProvider>
  </React.StrictMode>
);
