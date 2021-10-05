import React, {useEffect, useRef, useState} from "react";
import {Form, Button, Card, Container, Alert} from 'react-bootstrap'
import {useAuth} from "../contexts/AuthContext";
import {useHistory} from "react-router-dom";

export default function SignUp() {
	const emailRef = React.createRef()
	const passwordRef = useRef()
	const {signup, login} = useAuth() // Access to Auth functions and variables
	const [error, setError] = useState("")
	const [loading, setLoading] = useState(false)
	const [loggedIn, setloggedIn] = useState(false)
	const [signingIn, setSigningIn] = useState(true)
	const history = useHistory()

	// Navigate to profile when logged in successfully
	useEffect(() => {
		if (loggedIn) history.push('/profile')
	},[history, loggedIn]);

	// Runs when the sign up form is submitted
	async function handleSubmit(e) {
		e.preventDefault() // Prevents refresh

		const password = passwordRef.current.value
		const email = emailRef.current.value

		setError('')
		setLoading(true)

		try {
			if (signingIn) {
				if (password.length < 6) {
					setLoading(false)
					return setError('Password must be at least 6 characters long')
				}

				// Attempt Sign Up
				await signup(email, password) // Sign up (located in auth context)
				setSigningIn(false)
			} else {
				// Attempt Log In
				// Log In (located in auth context)
				await login(email, password).then(() => {setloggedIn(true)})
			}
		} catch (err) {
			setLoading(false)
			console.log(err.message)
			setError(err.message.toString())
		}

		setLoading(false)
	}

	return (
		<>
			<Container className="d-flex align-items-center justify-content-center" style={{minHeight: "40vh"}}>
				<div className="w-100" style={{maxWidth: "400px"}}>
					<Card>
						<Card.Body>
							<h2 className="text-center mb-4">{signingIn ? "Sign Up" : "Log In"}</h2>
							{error && <Alert variant="danger">{error}</Alert>}
							<Form onSubmit={handleSubmit}>
								<Form.Group id="email">
									<Form.Label>Email</Form.Label>
									<Form.Control type="email" ref={emailRef} required/>
								</Form.Group>
								<Form.Group id="password">
									<Form.Label>Password</Form.Label>
									<Form.Control type="password" ref={passwordRef} required/>
								</Form.Group>
								<br/>
								<Button disabled={loading} className="w-100" type="submit">
									{signingIn ? "Sign Up" : "Log In"}
								</Button>
							</Form>
						</Card.Body>
					</Card>
					<div className="w-100 text-center mt-2">
						<Button type="button" className="btn-light btn-link" onClick={() => {
							setSigningIn(!signingIn)
						}}>{signingIn ? "Already have an account? Login instead." : "Create an Account"}</Button>
					</div>
				</div>
			</Container>
		</>
	)
}