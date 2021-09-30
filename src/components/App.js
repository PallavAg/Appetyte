/** This file will control top-level handling for the website. Eg. routes. **/
import './css/App.css';
import React from "react";
import SignUpView from "./SignUpView";
import {AuthContextProvider} from "../contexts/AuthContext";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom"
import MyPantryView from "./MyPantryView";
import ProfileView from './ProfileView'
import NavigationBar from "./NavigationBar";

function App() {

	return (
		<>
			<Router>
				<NavigationBar/>
				<AuthContextProvider>
					<Switch>
						<Route exact path="/" component={MyPantryView}/>
						<Route path="/profile" component={ProfileView}/>
						<Route path="/login" component={SignUpView}/>
					</Switch>
				</AuthContextProvider>
			</Router>
		</>
	);

}

export default App;
