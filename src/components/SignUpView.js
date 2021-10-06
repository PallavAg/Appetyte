import React, {useEffect, useRef, useState} from "react";
import {Form, Button, Card, Container, Alert} from 'react-bootstrap'
import {useAuth} from "../contexts/AuthContext";
import {useHistory} from "react-router-dom";
import {toast} from "react-hot-toast";
import {initializeApp} from "firebase/app";
import {getFirestore, doc, setDoc, collection} from "firebase/firestore";

export default function SignUp() {
	const emailRef = React.createRef()
	const passwordRef = useRef()
	const passwordConfRef = useRef()
	const {signup, login, logout, uid, getUnverifiedUID} = useAuth() // Access to Auth functions and variables
	const [error, setError] = useState("")
	const [loading, setLoading] = useState(false)
	const [loggedIn, setLoggedIn] = useState(false)
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
		const passwordConfirm = passwordConfRef.current?.value
		const email = emailRef.current.value

		setError('')
		setLoading(true)

		try {
			if (signingIn) {
				if (password.length < 6) {
					setLoading(false)
					return setError('Password must be at least 6 characters long')
				}

				if (password !== passwordConfirm) {
					setLoading(false)
					return setError('Passwords do not match. Type it again.')
				}

				// Attempt Sign Up
				// Sign up (located in auth context)
				await signup(email, password).then((user) => {
					// Send verification email
					createUser(getUnverifiedUID());
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
						setLoggedIn(true)
						toast.success("Logged In Successfully!")
						// Have to put here since user isn't logged in until verified
						createUser();
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

	async function createUser()
	{
		if (!uid) {
			// User is logged out yet somehow this was called
			return;
		}

		// TODO: Remove this
		const firebaseConfig = {
			apiKey: "AIzaSyCqsDGSsqBVbApAf86ypvwLxP0qAmgH1-I",
			authDomain: "appetyte-7a6f6.firebaseapp.com",
			projectId: "appetyte-7a6f6",
			storageBucket: "appetyte-7a6f6.appspot.com",
			messagingSenderId: "470203778412",
			appId: "1:470203778412:web:5a5f9976d8081213a01f49",
			measurementId: "G-E8RDH36LL3"
		};

		const app = initializeApp(firebaseConfig);
		const db = getFirestore(app);

		const userRef = collection(db, "Users");
		await setDoc(doc(db, "Users", uid), {
			firstName: "",
			lastName: "",
			username: "",
		});

		logout()

	}

	function ConfirmPassword() {
		if (signingIn) {
			return (
				<Form.Group id="password-confirm" style={{padding: 5}}>
					<Form.Label>Confirm Password</Form.Label>
					<Form.Control type="password" ref={passwordConfRef} required/>
				</Form.Group>
			)
		} else {
			return (<></>)
		}

	}

	return (
		<>
			<Container className="d-flex align-items-center justify-content-center" style={{padding: 30}}>
				<div className="w-100" style={{maxWidth: "400px"}}>
					<Card>
						<Card.Body>
							<h2 className="text-center mb-4">{signingIn ? "Sign Up" : "Log In"}</h2>
							{error && <Alert variant="danger">{error}</Alert>}
							<Form onSubmit={handleSubmit}>
								<Form.Group id="email" style={{padding: 5}}>
									<Form.Label>Email</Form.Label>
									<Form.Control type="email" ref={emailRef} required/>
								</Form.Group>
								<Form.Group id="password" style={{padding: 5}}>
									<Form.Label>Password</Form.Label>
									<Form.Control type="password" ref={passwordRef} required/>
								</Form.Group>
								<ConfirmPassword/>
								<br/>
								<Button disabled={loading} className="w-100" type="submit">
									{signingIn ? "Sign Up" : "Log In"}
								</Button>
							</Form>
						</Card.Body>
					</Card>
					<div className="w-100 text-center mt-2">
						<Button type="button" className="btn-light btn-link shadow-none" onClick={() => {
							setSigningIn(!signingIn); setError('')
						}}>{signingIn ? "Already have an account? Login instead." : "Create an Account"}</Button>
					</div>
				</div>
			</Container>
		</>
	)
}