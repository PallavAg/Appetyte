import React, {useState} from "react";
import {Button} from 'react-bootstrap'
import {Link} from "react-router-dom";
import {toast} from "react-hot-toast";

export default function UploadFileView() {
	const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);

	const [error, setError] = useState("")
	const [result, setResult] = useState("")

	const changeHandler = (event) => {
		event.preventDefault()
		let file = event.target.files[0]
		if (!file) return
		setResult("")
		setError("")
		setSelectedFile(file);
		setIsFilePicked(true);
		checkIfValidCSV(file)
	};

	function checkIfValidCSV(file) {
		if (!file.type.toString().includes("csv")) {
			setError("Oops! '" + file.name + "' is not a CSV file. Please upload a CSV.")
			setIsFilePicked(false)
		}
	}

	function handleSubmission() {
		const reader = new FileReader()
		reader.onload = parseCSV
		reader.readAsText(selectedFile)
	}

	// Todo: Parse and Upload to Firestore
	function parseCSV(e) {
		let csv = e.target.result.toString()
		let noError = true

		cleanUp(noError, "5 Recipes successfully created!")
	}

	function cleanUp(noError, text) {
		if (noError) {
			setResult(text)
			toast.success("Recipes Created!")
			setIsFilePicked(false)
			setError("")
			document.getElementById("input").value = null;
		} else {
			setIsFilePicked(false)
			setError("Oops! ABC has no ingredients. Please fix and re-upload.")
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
