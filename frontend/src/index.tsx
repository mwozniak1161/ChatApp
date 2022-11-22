import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { SocketProvider } from './contexts/Socket';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './contexts/User';
import { CssBaseline } from '@mui/material';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter >
  <UserProvider> 
    <CssBaseline/>
    <App />
  </UserProvider>
  </BrowserRouter>
);
