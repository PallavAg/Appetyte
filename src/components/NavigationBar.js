import React from "react";
import {Link} from "react-router-dom";

export default function NavigationBar() {
	return (
		<div className='navigationBar' >
			<div className='navigationBarContent'>
				<Link to="/" className='homeButton' style={{textDecoration: 'none'}}>Appetyte</Link>
				<span className='rightJustified'>
                        <label className='navigationBarText'>Cookbook</label>
                        <Link to="/pantry" className='navigationBarText'>{" My Pantry "}</Link>
                        <Link to="/profile" className='navigationBarText'>{" Profile "}</Link>
                        <Link to="/login" className='navigationBarText'>{" Login"}</Link>
                    </span>
			</div>
		</div>
	);
}
