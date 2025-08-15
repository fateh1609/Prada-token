
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App';
import '@/index.css';
import { WalletProvider } from '@/contexts/WalletContext';
import { AuthProvider }   from '@/contexts/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WalletProvider>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>  
      </BrowserRouter>
    </WalletProvider>
  </React.StrictMode>
);
