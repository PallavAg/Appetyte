import React, {useContext, useEffect, useState} from "react";
import {auth} from "../firebase";

const AuthContext = React.createContext()

export function useAuth() {
	return useContext(AuthContext)
}

export function AuthContextProvider({children}) {
	const [currentUser, setCurrentUser] = useState()
	const [uid, setUid] = useState()
	const [loading, setLoading] = useState(true)

	function signup(email, password) {
		return auth.createUserWithEmailAndPassword(email, password)
	}

	function login(email, password) {
		return auth.signInWithEmailAndPassword(email, password)
	}

	function logout() {
		return auth.signOut()
	}

	function getUnverifiedUID() {
		// To be used when signing up before user is verified
		// Nothing changes about uid after verification, but the
		// user's uid object just won't be set at this point
		return auth.currentUser.uid;
	}

	function deleteAccount() {
		return auth.currentUser?.delete()
	}

	// Runs only once
	useEffect(() => {
		// When signup() completes, auth changes and calls setCurrentUser()
		return auth.onAuthStateChanged(user => {
			setUid(user ? user.uid : null)
			setCurrentUser(user)
			setLoading(false)
		})
	}, [])

	const value = {
		uid,
		currentUser,
		signup,
		login,
		logout,
		deleteAccount,
		setUid,
		getUnverifiedUID
	}

	return (
		<AuthContext.Provider value={value}>
			{!loading && children}
		</AuthContext.Provider>
	)
}