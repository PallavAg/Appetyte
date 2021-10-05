import React, {useState} from "react";
import {useAuth} from "../contexts/AuthContext";
import {useHistory} from "react-router-dom";

export default function ProfileView() {
	const [userName, setUserName] = useState("N/A")
	const {currentUser, logout, uid} = useAuth()
	const history = useHistory()

	async function handleLogout() {
		try {
			await logout()
			history.push("/login")
		} catch (err) {
			console.log(err.message)
		}
	}

	function ProfileInfo() {
		if (uid) {
			return (
				<div>
					<div className='pageSubtitle'>USERNAME</div>
					<div className='pageSubSubtitle'>{userName}</div>
					<div className='pageSubtitle'>EMAIL</div>
					<div className='pageSubSubtitle'>{currentUser.email}</div>
				</div>
			);
		} else {
			return (<></>)
		}
	}

	return (
		<div>
			<div className='contentInsets'>
				<div className='pageTitle'>Your Profile</div>
				<div className='contentInsets'>
					<ProfileInfo/>
					<div>
						<button className='standardButton'
								onClick={handleLogout}>{currentUser ? "Log Out" : "Log In"}</button>
					</div>
				</div>
			</div>
		</div>
	);
}
