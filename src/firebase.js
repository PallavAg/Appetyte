import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/firestore"

const app = firebase.initializeApp({
	apiKey: "AIzaSyCqsDGSsqBVbApAf86ypvwLxP0qAmgH1-I",
	authDomain: "appetyte-7a6f6.firebaseapp.com",
	projectId: "appetyte-7a6f6",
	storageBucket: "appetyte-7a6f6.appspot.com",
	messagingSenderId: "470203778412",
	appId: "1:470203778412:web:5a5f9976d8081213a01f49",
	measurementId: "G-E8RDH36LL3"
})

const testing = false;

const db = app.firestore();
if (testing) {
	db.useEmulator("localhost", 8080);
}

const auth = app.auth();
if (testing) {
	auth.useEmulator("http://localhost:9099");
}

export {testing, auth, db}
export default app