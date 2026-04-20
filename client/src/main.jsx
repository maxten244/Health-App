import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { CrisisProvider } from './context/CrisisContext';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CrisisProvider>
          <App />
        </CrisisProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
