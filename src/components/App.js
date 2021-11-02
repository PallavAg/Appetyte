/** This file will control top-level handling for the website. Eg. routes. **/
import './css/App.css';
import React from "react";
import SignUpView from "./SignUpView";
import {AuthContextProvider} from "../contexts/AuthContext";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom"
import {Toaster} from 'react-hot-toast';
import MyPantryView from "./MyPantryView";
import ProfileView from './ProfileView'
import NavigationBar from "./NavigationBar";
import CreateRecipeView from './CreateRecipeView'
import IngredientView from "./Subviews/IngredientView";
import SearchPage from "./SearchPage";

// Make sure everything is within <AuthContextProvider>
function App() {

	return (
		<>
			<Router>
				<AuthContextProvider>
					<Toaster/>
					<NavigationBar/>
					<Switch>
						<Route exact path="/" component={SearchPage}/>
						<Route path="/create_recipe" component={CreateRecipeView}/>
						<Route path="/pantry" component={MyPantryView}/>
						<Route path="/profile" component={ProfileView}/>
						<Route path="/login" component={SignUpView}/>
						<Route path="/ingredients" component={IngredientView}/>
						<Route path="/search" component={SearchPage}/>
					</Switch>
				</AuthContextProvider>
			</Router>
		</>
	);

}

export default App;
