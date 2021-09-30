import React, {useContext, useEffect, useState} from "react";
import {auth} from "../firebase";

const AuthContext = React.createContext()

export function useAuth() {
	return useContext(AuthContext)
}

export function AuthContextProvider({children}) {
	const [currentUser, setCurrentUser] = useState()
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

	// Runs only once
	useEffect(() => {
		// When signup() completes, auth changes and calls setCurrentUser()
		return auth.onAuthStateChanged(user => {
			setCurrentUser(user)
			setLoading(false)
		})
	}, [])

	const value = {
		currentUser,
		signup,
		login,
		logout
	}

	return (
		<AuthContext.Provider value={value}>
			{!loading && children}
		</AuthContext.Provider>
	)
}