import React from "react";
import {Link} from "react-router-dom";
import {useAuth} from "../contexts/AuthContext";

export default function NavigationBar() {
	const {uid} = useAuth()

	return (
		<div className='navigationBar' >
			<div className='navigationBarContent'>
				<Link to="/" className='homeButton' style={{textDecoration: 'none'}}>Appetyte</Link>
				<span className='rightJustified'>
                        <label className='navigationBarText'>Cookbook</label>
                        <Link to="/pantry" className='navigationBarText'>{" My Pantry "}</Link>
                        <Link to="/profile" className='navigationBarText'>{" Profile "}</Link>
                        <Link to="/login" className='navigationBarText'>{uid ? "Logout" : "Login"}</Link>
                    </span>
			</div>
		</div>
	);
}
