/** This file will control top-level handling for the website. Eg. routes. **/
import './css/App.css';
import React from "react";
import SignUpView from "./SignUpView";
import {AuthContextProvider} from "../contexts/AuthContext";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom"
import MyPantryView from "./MyPantryView";
import ProfileView from './ProfileView'
import NavigationBar from "./NavigationBar";
import CreateRecipeView from './CreateRecipeView'
import IngredientView from "./IngredientView";

function App() {

	return (
		<>
			<Router>
				<AuthContextProvider>
					<NavigationBar/>
					<Switch>
						<Route exact path="/" component={CreateRecipeView}/>
						<Route path="/create_recipe" component={CreateRecipeView}/>
						<Route path="/pantry" component={MyPantryView}/>
						<Route path="/profile" component={ProfileView}/>
						<Route path="/login" component={SignUpView}/>
						<Route path="/ingredients" component={IngredientView}/>
					</Switch>
				</AuthContextProvider>
			</Router>
		</>
	);

}

export default App;
