import React, {useState} from "react";
import {Button} from 'react-bootstrap'
import {Link} from "react-router-dom";
import {toast} from "react-hot-toast";
import { readString } from 'react-papaparse'
import {useAuth} from "../contexts/AuthContext";
import {addDoc, arrayUnion, collection, doc, updateDoc} from "firebase/firestore";
import {db} from "../firebase";
import {forEach} from "react-bootstrap/ElementChildren";

export default function UploadFileView() {

	const {uid} = useAuth();

	const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);

	const [error, setError] = useState("")
	const [result, setResult] = useState("")

	const changeHandler = (event) => {
		event.preventDefault()
		let file = event.target.files[0]
		setError("")
		if (!file) return
		setResult("")
		setSelectedFile(file);
		setIsFilePicked(true);
		checkIfValidCSV(file)
	};

	function checkIfValidCSV(file) {
		if (!(file.type.toString().includes("csv") || file.type.toString().includes("application/vnd.ms-excel"))) {
			setError("Oops! '" + file.name + "' is not a CSV file. Please upload a CSV.")
			setIsFilePicked(false)
		}
	}

	function handleSubmission() {
		document.getElementById("input").value = null;
		const reader = new FileReader()
		reader.onload = getCSVString
		reader.readAsText(selectedFile)
	}

	// Todo: Parse and Upload to Firestore
	function getCSVString(e) {
		let csv = e.target.result.toString()
		csv.replace(/\n+$/, "") // Remove trailing newlines

		readString(csv, {
			worker: true,
			complete: parseCSV
		})

	}

	async function parseCSV(results) {

		console.log(results.data)

		let error = false
		let text = (results.data.length - 1) + " Recipes successfully created!"

		// Check CSV Correctness
		//for (let i in results.data) {
		for (let i = 0; i < results.data.length; i++) {
			if (results.data[i].length !== 8) {
				console.log(results.data[i]);
				error = true
				text = "Oops! Please ensure CSV has all 8 headers, even if they are empty."
				break
			}

			for (let j = 0; j < results.data[i].length; j++) {
				let cell = results.data[i][j]

				if (cell.length === 0 && [0, 1, 3].includes(j)) {
					error = true
					text = "Oops! Recipe on row " + i + " does not contain all the required information."
					break
				}
			}

			if (error) break
		}

		// Found CSV bug. Display error.
		if (error) {
			cleanUp(error, text)
			return
		}

		await results.data.shift() // Remove header row

		// Upload CSV data to firestore
		for (let i in results.data) {
			let r = results.data[i]

			let coreIngredients = []
			let sideIngredients = []
			r[1].split(',').forEach((ingredient) => coreIngredients.push({name: ingredient.trim(), quantity: ""}))
			if (r[2].length !== 0) {
				r[2].split(',').forEach((ingredient) => sideIngredients.push({name: ingredient.trim(), quantity: ""}))
			}

			const recipe = {
				name: r[0],
				coreIngredients: coreIngredients,
				sideIngredients: sideIngredients,
				instructions: r[3].split(','),
				author: uid,
				upvotedList: [],
				downvotedList: [],
				recipeType: (r[7].toLowerCase() === "no") ? "Private" : "Public",
				tags: r[4].split(','),
				image: r[5],
				blurb: r[6],
				madeList: []
			}

			// Add recipe to database
			let recipeRef = collection(db, "Recipes");
			const docRef = await addDoc(recipeRef, recipe)

			// Add recipe id under list of user's created recipes
			let userCreatedRecipesRef = doc(db, "Users", uid);
			await updateDoc(userCreatedRecipesRef, { createdRecipes: arrayUnion(docRef.id) });

		}

		cleanUp(false, text) // Completion message
	}

	function cleanUp(error, text) {
		if (!error) {
			toast.success("Recipes Created!")
			setIsFilePicked(false)
			setResult(text)
			setError("")
			document.getElementById("input").value = null;
		} else {
			setResult("")
			setError(text)
			setIsFilePicked(false)
		}
	}

	return (
		<div>
			<div className='contentInsets'>
				<div className='contentInsets'>
					<div className='pageTitle'>Upload Your Recipes</div>
					<h4>Upload a CSV-formatted file with your recipes!</h4>
					<br/>
					<h3><b>The format is as follows:</b></h3>
					<h4>Name, Core Ingredients, Side Ingredients, Instructions, Tags, Image URL, Other Information, Public</h4>
					<Link to="/SampleFile.csv" target="_blank" download>Download Sample CSV</Link>
					<br/><br/>
					<h5>Ingredients and Instructions should be seperated by a comma</h5>
					<h5>Required fields: Name, Core Ingredients, Instructions</h5>
					<br/>
					<input id="input" type="file" accept=".csv" name="file" onChange={changeHandler} />
					<h5 style={{paddingTop: '15px', color: 'green'}}>{result}</h5>
					{isFilePicked ?
						<div>
							<Button className="btn-lg" onClick={handleSubmission}>Create Recipes!</Button>
						</div>
						:
						<h5 style={{color: 'red'}}>{error}</h5>
					}
				</div>
			</div>
		</div>
	);
}
