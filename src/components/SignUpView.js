import React, {useEffect, useRef, useState} from "react";
import {Form, Button, Card, Container, Alert} from 'react-bootstrap'
import {useAuth} from "../contexts/AuthContext";
import {useHistory} from "react-router-dom";
import {toast} from "react-hot-toast";

export default function SignUp() {
	const emailRef = React.createRef()
	const passwordRef = useRef()
	const {signup, login, logout} = useAuth() // Access to Auth functions and variables
	const [error, setError] = useState("")
	const [loading, setLoading] = useState(false)
	const [loggedIn, setloggedIn] = useState(false)
	const [signingIn, setSigningIn] = useState(true)
	const history = useHistory()

	// Navigate to profile when logged in successfully
	useEffect(() => {
		if (loggedIn) history.push('/')
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
				// Sign up (located in auth context)
				await signup(email, password).then((user) => {
					// Send verification email
					logout()
					user.user.sendEmailVerification().then(() => {
						window.localStorage.setItem('emailForSignIn', email);
						toast.success("Email sent. Verify email to login.")
					}).catch((error) => {
						toast.success("Unable to send verification email")
						console.log(error)
					})
				})
				setSigningIn(false)
			} else {
				// Attempt Log In
				// Log In (located in auth context)
				await login(email, password).then((user) => {
					if (user.user.emailVerified) {
						setloggedIn(true)
						toast.success("Logged In Successfully!")
					} else {
						logout()
						toast.error("You need to verify your email before logging in")
					}
				})
			}
		} catch (err) {
			setLoading(false)
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
							setSigningIn(!signingIn); setError('')
						}}>{signingIn ? "Already have an account? Login instead." : "Create an Account"}</Button>
					</div>
				</div>
			</Container>
		</>
	)
}