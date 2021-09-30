import React from 'react';
import ReactDOM from 'react-dom';
import './components/css/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './components/App';

// Change "<App />" for testing purposes
ReactDOM.render(
  <React.StrictMode>
      <App />
  </React.StrictMode>,
  document.getElementById('root')
);
