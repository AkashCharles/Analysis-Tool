import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { EarthoOneProvider } from '@eartho/one-client-react';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebase';

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <EarthoOneProvider clientId='GW3vZIQBAjfcohduhBNX'>
      <App />
    </EarthoOneProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
