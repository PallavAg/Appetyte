import React, {useState} from "react";
import {useAuth} from "../contexts/AuthContext";
import {useHistory} from "react-router-dom";

export default function ProfileView() {
	const [userName, setUserName] = useState("N/A")
	const [email, setEmail] = useState("janedoe@example.com")
	const {currentUser, logout} = useAuth()
	const history = useHistory()

	async function handleLogout() {
		try {
			await logout()
			history.push("/login")
		} catch (err) {
			console.log(err.message)
		}
	}

	return (
		<div>
			<div className='contentInsets'>
				<div className='pageTitle'>Your Profile</div>
				<div className='contentInsets'>
					<div className='pageSubtitle'>USERNAME</div>
					<div className='pageSubSubtitle'>{userName}</div>
					<div className='pageSubtitle'>EMAIL</div>
					<div className='pageSubSubtitle'>{currentUser ? currentUser.email : "Logged Out"}</div>
					<div>
						<button className='standardButton' onClick={handleLogout}>Log Out</button>
					</div>
				</div>
			</div>
		</div>
	);
}
