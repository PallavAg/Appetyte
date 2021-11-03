import React from "react";
import {Link} from "react-router-dom";
import {useAuth} from "../contexts/AuthContext";
import {Nav, Navbar} from "react-bootstrap";

export default function NavigationBar() {
	const {uid} = useAuth()

	return (
		<div>
			<Navbar variant="dark" className="navbar navigationBar navigationBarContent py-3">
				<Navbar.Brand as={Link} to="/" className="navbar-brand homeButton">Appetyte</Navbar.Brand>
				<Nav className="me-auto">
					<Nav.Link as={Link} to="/search">Search</Nav.Link>
					<Nav.Link as={Link} to="/create_recipe">Create Recipe</Nav.Link>
					<Nav.Link as={Link} to="/ingredients">Ingredients</Nav.Link>
					<Nav.Link as={Link} to="/pantry">My Pantry</Nav.Link>
					<Nav.Link as={Link} to="/cookbook">My Cookbook</Nav.Link>
					<Nav.Link as={Link} to={uid ? "/profile" : "/login"}>{uid ? "Profile" : "Login"}</Nav.Link>
				</Nav>
			</Navbar>
		</div>
	);
}
