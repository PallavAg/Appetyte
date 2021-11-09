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
import RecipeView from "./Subviews/RecipeView";
import CookbookView from "./CookbookView";
import VerifierView from "./VerifierView";
import UploadFileView from "./UploadFileView";

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
						<Route path="/recipe_view" component={RecipeView}/>
						<Route path="/cookbook" component={CookbookView}/>
						<Route path="/upload" component={UploadFileView}/>
						<Route path="/tests" component={VerifierView}/>
					</Switch>
				</AuthContextProvider>
			</Router>
		</>
	);

}

export default App;
