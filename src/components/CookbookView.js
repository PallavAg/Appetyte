import React, {useEffect, useState, useRef} from "react"
import RecipePreviewCard from "./Subviews/RecipePreviewCard";
import {Container, Button, Form, Row, Col} from "react-bootstrap";
import { SegmentedControl } from 'segmented-control'
import {db} from "../firebase";
import {collection, query, where, getDocs, doc, getDoc} from "firebase/firestore"

import {useAuth} from "../contexts/AuthContext"
import {Link, useLocation} from "react-router-dom";
import RecipeView from "./Subviews/RecipeView";

const SearchType = {
    CREATED: 0,
    SAVED: 1,
}

export default function CookbookView() {

    const [segmentedCtrlState, setSegmentedCtrlState] = useState(0);

    const [displayedRecipes, setDisplayedRecipes] = useState([]);
    const [createdRecipes, setCreatedRecipes] = useState([]);
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [tableLabel, setTableLabel] = useState("");

    const { profileID } = useLocation();
    const [username, setUserName] = useState("");
    const [fullName, setFullName] = useState("");

    const [error, setError] = useState("");

    // Show the search bar
    const [hideSearchBar, setHideSearchBar] = useState('block');

    const [viewing, setViewing] = useState(false);
    const [viewingID, setViewingID] = useState()

    // TODO: DELETE THIS
    //const [testOutput, setTestOutput] = useState("");

    const searchQuery = useRef("");

    const {uid} = useAuth();

    async function getRecipes() {
        setDisplayedRecipes([])
        setFullName("")
        setUserName("")

        // Load created recipe ids
        let createdRecipes = []
        // Load saved recipe ids
        let savedRecipes = []

        let qUser = query(doc(db, "Users", profileID ? profileID : uid));

        const userSnapshot = await getDoc(qUser);
        if (userSnapshot.exists()) {
            createdRecipes = userSnapshot.data().createdRecipes;
            savedRecipes = userSnapshot.data().saved;
            setFullName(userSnapshot.data().firstName + " " + userSnapshot.data().lastName)
            setUserName(userSnapshot.data().username)
        }

        // Perform lookup in recipe collection on these saved recipes
        const qLookup = query(collection(db, "Recipes"))
        let createdRecipesData = []
        let savedRecipesData = []
        // Note: see comment in search page for why I couldn't do where(documentId(), "in", cookBookRecipes)
        const recipesSnapshot = await getDocs(qLookup);
        recipesSnapshot.forEach((doc) => {
            if (createdRecipes.includes(doc.id)) {
                if (profileID) {
                    if (doc.data().recipeType !== "Private") {
                        createdRecipesData.push({id: doc.id, data: doc.data()})
                    }
                } else createdRecipesData.push({id: doc.id, data: doc.data()})
            }
            if (savedRecipes.includes(doc.id)) {
                savedRecipesData.push({id: doc.id, data: doc.data()})
            }
        })

        // Set recipes for use throughout the page
        setCreatedRecipes(createdRecipesData);

        // Prevent ever showing saved recipes
        if (profileID) savedRecipesData = createdRecipesData

        setSavedRecipes(savedRecipesData);

        // Display results in case user hasn't changed the segmented control yet
        if (segmentedCtrlState === SearchType.CREATED) {
            setDisplayedRecipes([...createdRecipesData]);
        } else {
            setDisplayedRecipes([...savedRecipesData]);
        }

    }

    function updateSegmentedCtrlState(newValue) {
        setSegmentedCtrlState(newValue);
        if (newValue === SearchType.CREATED) {
            setDisplayedRecipes([...createdRecipes]);
        }
        else if (newValue === SearchType.SAVED) {
            setDisplayedRecipes([...savedRecipes]);
        }
    }

    function updateResults() {
        return displayedRecipes.map((recipe) =>
            <div style={{paddingLeft: '1rem', paddingRight: '1rem', paddingBottom: '1rem'}} onClick={() => {setViewingID(recipe.id)}}>
                {React.createElement(RecipePreviewCard, {key: recipe.id, id: recipe.id, recipe: recipe.data, interactiveElement: profileID ? 'block' : 'none', viewingState: setViewing, savedView: segmentedCtrlState})}
            </div>
        );

    }

    function searchForRecipe(e) {
        e.preventDefault()

        // Restore recipes to all to remove previous filters
        let allRecipes;
        if (segmentedCtrlState === SearchType.CREATED) {
            allRecipes = [...createdRecipes];
        }
        else if (segmentedCtrlState === SearchType.SAVED) {
            allRecipes = [...savedRecipes];
        }


        if (searchQuery.current.value === "") {
            setDisplayedRecipes(allRecipes);
            return;
        }

        // Searching by name
        const names = searchQuery.current.value.toLowerCase().split(" ").filter(name =>
            // Filter out useless words
            (name !== "" && name !== "in" && name !== "a" && name !== "the" && name !== "and")
        )

        let tempRecipes = [];

        for (let i = 0; i < allRecipes.length; i++) {
            let recipeName = allRecipes[i].data.name;
            for (let l = 0; l < names.length; l++) {
                if (recipeName.toLowerCase().includes(names[l])) {
                    tempRecipes.push(allRecipes[i]);
                    break;
                }
            }
        }

        setDisplayedRecipes([...tempRecipes]);
    }

    useEffect(() => {
        if (uid === null) {
            setError("Error: You must be logged in to view this.");
            return;
        }

        getRecipes()

    }, [profileID]);

    function ShowNoResults() {
        if (displayedRecipes.length === 0) {
            return <div>No Results</div>
        } else {
            return <div></div>
        }
    }

    return (
        <div className='contentInsets'>
            {!viewing ?
                <div>
                    <div className='pageTitle' style={{textAlign: profileID ? 'center' : ''}}> {profileID ? fullName : "Cookbook"} </div>
                    {profileID ? <h5 style={{textAlign: 'center', marginTop: '-20px'}} >{"'" + username + "'"}</h5> : <></>}
                    <div style={{color: 'red', paddingTop: error.length === 0 ? '0rem' : '1rem', fontSize: 17}}>{error}</div>
                    <div style={{backgroundColor: 'steelblue', borderRadius: 15, padding: '1rem', display: profileID ? 'none' : 'block'}}>
                        {/*<div>{JSON.stringify(testOutput)}</div>*/}
                        <Container>
                            <div style={{color: 'white', textAlign: 'center', verticalAlign: 'bottom', fontWeight: 'bold', fontSize: 17,}}>
                            </div>
                            <Row>
                                <Col >
                                </Col>
                                <Col>
                                    <SegmentedControl // Using container in order to center the segmented control
                                        name="oneDisabled"
                                        options={[
                                            { label: "Created Recipes", value: 0, default: true},
                                            { label: "Saved Recipes", value: 1}
                                        ]}
                                        setValue={newValue => updateSegmentedCtrlState(newValue)}
                                        style={{ width: 600, color: 'grey', backgroundColor: 'white', borderColor: 'white', borderWidth: 4, borderRadius: '15px', fontSize: 15}} // purple400
                                    />
                                </Col>
                                <Col>
                                </Col>
                            </Row>
                        </Container>
                        <Form>
                            <Form.Group className="mb-3" controlId="search" >
                                <Form.Control
                                    type="name"
                                    placeholder={"Search"}
                                    style={{display: hideSearchBar, marginBottom: "0.5rem"}}
                                    ref={searchQuery}
                                />
                            </Form.Group>
                            <Button style={{borderRadius: 5, float: 'center', color: 'black', backgroundColor: 'lightgray', borderColor: 'lightgray'}}
                                    type='submit'   // This makes it search when you hit enter
                                    onClick={e => searchForRecipe(e)}>Search</Button>
                        </Form>
                        <Form className='leftContentInsets'>
                        </Form>
                    </div>
                    <div className='leftAndRightContentInsets' style={{backgroundColor: 'lightgray', paddingTop: '1rem', borderRadius: profileID ? '15px 15px 15px 15px' : '0px 0px 15px 15px'}}>
                        {tableLabel.length ? <div style={{textAlign: 'center', fontSize: 20, paddingBottom: '1rem'}}>
                            <ShowNoResults/>
                        </div> : <></>}
                        <div>{updateResults()}</div>
                    </div>
                </div>
            :
                <div>
                    <h2 onClick={() => {setViewing(!viewing)}}>←</h2>
                    {React.createElement(RecipeView, {id: viewingID, viewingState: setViewing})}
                </div>
            }
        </div>
    );

}
