import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from "react-helmet-async";
import { SnackbarProvider } from "notistack";
import App from './App';
import { AuthProvider, LayoutProvider } from "./states";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <LayoutProvider>
        <SnackbarProvider>
          <App />
          </SnackbarProvider>
        </LayoutProvider>
      </AuthProvider>
    </HelmetProvider>
  </React.StrictMode>
);
