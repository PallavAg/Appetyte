import React, {useRef} from "react";
import {Form, Button, Card, Container} from 'react-bootstrap'
// import { Link, useHistory } from "react-router-dom"

export default function Login() {
	const emailRef = useRef()
	const passwordRef = useRef()

	return (
		<>
			<Container className="d-flex align-items-center justify-content-center" style={{minHeight: "40vh"}}>
				<div className="w-100" style={{maxWidth: "400px"}}>
					<Card>
						<Card.Body>
							<h2 className="text-center mb-4">Sign Up</h2>
							{/*{error && <Alert variant="danger">{error}</Alert>}*/}
							<Form>
								<Form.Group id="email">
									<Form.Label>Email</Form.Label>
									<Form.Control type="email" ref={emailRef} required/>
								</Form.Group>
								<Form.Group id="password">
									<Form.Label>Password</Form.Label>
									<Form.Control type="password" ref={passwordRef} required/>
								</Form.Group>
								<Button className="w-100" type="submit">
									Sign Up
								</Button>
							</Form>
						</Card.Body>
					</Card>
					<div className="w-100 text-center mt-2">
						Already have an account?
					</div>
				</div>
			</Container>
		</>
	)
}