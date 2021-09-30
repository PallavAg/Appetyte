import React from 'react';
import ReactDOM from 'react-dom';
import './components/css/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './components/App';
import ProfileView from './components/ProfileView'
import LoginView from './components/LoginView'
import IngredientView from "./components/IngredientView";
import MyPantryView from "./components/MyPantryView";

ReactDOM.render(
  <React.StrictMode>
    <MyPantryView/>
  </React.StrictMode>,
  document.getElementById('root')
);
