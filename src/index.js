import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import FirebaseContext from './contexts/FirebaseContext';
import { FieldValue } from './firebase';

ReactDOM.render(
  <React.StrictMode>
    <FirebaseContext.Provider value={{ FieldValue }}>
      <App />
    </FirebaseContext.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);