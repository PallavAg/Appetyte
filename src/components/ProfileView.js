import React, {useEffect, useState} from "react";
import {Button} from 'react-bootstrap'
import {useAuth} from "../contexts/AuthContext";
import {Link, useHistory} from "react-router-dom";
import {toast} from "react-hot-toast";
import {db} from "../firebase";
import {addDoc, collection} from "firebase/firestore";

export default function ProfileView() {
	const [userName, setUserName] = useState("Loading...")
	const [firstName, setFirstName] = useState("Loading...")
	const [lastName, setLastName] = useState("Loading...")
	const {currentUser, logout, deleteAccount, uid} = useAuth()
	const history = useHistory()

	async function handleLogout() {
		try {
			let wasLoggedIn = uid
			await logout()
			if (wasLoggedIn) toast.success("You have been logged out")
			history.push("/login")
		} catch (err) {
			console.log(err.message)
		}
	}

	async function handleDelete() {
		if (window.confirm("Are you sure you want to delete your account and data?")) {
			try {
				// Delete from firebase auth
				await deleteAccount().then(() => {
					history.push("/login")
					toast.success("Account deleted successfully.")
					// Delete from firestore
					db.collection("Users").doc(uid).delete()
				})
			} catch (err) {
				toast.error("Logout and Log in again to delete account")
				console.log(err.message)
			}
		}
	}

	function submitFeedback() {
		const feedback = prompt("Submit feedback or suggestions anonymously: ");
		if (feedback && feedback.length !== 0) {
			addDoc(collection(db, "Feedback"), { feedback: feedback }).then(() => {
				toast.success("Feedback submitted!")
			});
		}
	}

	// Grab username from firebase and show on screen
	// This block of code runs once when the page is loaded.
	useEffect(() => {
		if (uid) {
			db.collection("Users").doc(uid).get().then((doc) => {
				if (doc.exists) {
					setUserName(doc.data().username)
					setFirstName(doc.data().firstName)
					setLastName(doc.data().lastName)
				}
			})
			db.collection("Users").doc(uid).get().then((doc) => {
				setFirstName(doc.data().firstName)
			})
			db.collection("Users").doc(uid).get().then((doc) => {
				setLastName(doc.data().lastName)
			})
		}
	})

	function ProfileInfo() {
		if (uid) {
			return (
				<div>
					<div className='pageSubtitle'>NAME</div>
					<div className='pageSubSubtitle'>{firstName + " " + lastName}</div>
					<div className='pageSubtitle'>USERNAME</div>
					<div className='pageSubSubtitle'>{userName}</div>
					<div className='pageSubtitle'>EMAIL</div>
					<div className='pageSubSubtitle'>{currentUser.email}</div>
					<div style={{'margin-bottom': 10}}>
						<Link to={{ pathname: `/upload`}}>
							<Button className="btn-success">{"Upload Recipes"}</Button>
						</Link >
					</div>
					<div style={{'margin-bottom': 10}}>
						<Button className="btn btn-secondary" onClick={submitFeedback}>{"Submit Feedback"}</Button>
					</div>
					<Button className="btn-danger" onClick={handleDelete}>{"Delete Account"}</Button>

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
					<br/>
					<Button className="btn-lg" onClick={handleLogout}>{currentUser ? "Log Out" : "Log In"}</Button>
				</div>
			</div>
		</div>
	);
}
