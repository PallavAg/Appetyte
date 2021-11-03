import React, {useEffect, useState, useRef} from "react"
import RecipePreviewCard from "./Subviews/RecipePreviewCard";
import {Container, Button, Form, Row, Col} from "react-bootstrap";
import { SegmentedControl } from 'segmented-control'
import {db} from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore"

import {useAuth} from "../contexts/AuthContext"
import {Link, useLocation} from "react-router-dom";

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
    // const { state } = useLocation();

    // Show the segmented control
    const [segmentedControlHeight, hideComponentsWhenLoggedOut] = useState('block');
    // Show the search bar
    const [hideSearchBar, setHideSearchBar] = useState('block');


    // TODO: DELETE THIS
    const [testOutput, setTestOutput] = useState("");

    const searchQuery = useRef("");

    const {uid} = useAuth();

    async function getRecipes() {
        console.log("get recipes");

        // Load created recipe ids
        const createdRecipes = []
        const qCookbook = query(collection(db, "Users", uid, "CreatedRecipes"));
        const cookbookSnapshot = await getDocs(qCookbook);
        cookbookSnapshot.forEach((doc) => {
            createdRecipes.push(doc.id);
        });

        // Load saved recipe ids
        const savedRecipes = []
        const qSaved = query(collection(db, "Users", uid, "SavedRecipes"))
        const savedRecipesSnapshot = await getDocs(qSaved);
        savedRecipesSnapshot.forEach((doc) => {
            savedRecipes.push(doc.id)
        });

        // Perform lookup in recipe collection on these saved recipes
        const qLookup = query(collection(db, "Recipes"))
        let createdRecipesData = []
        let savedRecipesData = []
        // Note: see comment in search page for why I couldn't do where(documentId(), "in", cookBookRecipes)
        const recipesSnapshot = await getDocs(qLookup);
        recipesSnapshot.forEach((doc) => {
            if (createdRecipes.includes(doc.id)) {
                createdRecipesData.push({id: doc.id, data: doc.data()})
            }
            else if (savedRecipes.includes(doc.id)) {
                savedRecipesData.push({id: doc.id, data: doc.data()})
            }
        })

        // Set recipes for use throughout the page
        setCreatedRecipes(createdRecipesData);
        setSavedRecipes(savedRecipesData);

        // Display results in case user hasn't changed the segmented control yet
        if (segmentedCtrlState === SearchType.CREATED) {
            setDisplayedRecipes(createdRecipesData);
            setTestOutput(createdRecipesData)
        } else {
            setDisplayedRecipes(savedRecipesData);
            setTestOutput(savedRecipesData)
        }

    }

    function updateSegmentedCtrlState(newValue) {
        setSegmentedCtrlState(newValue);
        if (newValue === SearchType.CREATED) {
            setDisplayedRecipes(createdRecipes);
            setTestOutput(createdRecipes);
        }
        else if (newValue == SearchType.SAVED) {
            setDisplayedRecipes(savedRecipes);
            setTestOutput(savedRecipes);
        }
    }

    function updateResults() {
        return displayedRecipes.map((recipe) =>
            <div style={{paddingLeft: '1rem', paddingRight: '1rem', paddingBottom: '1rem'}}>
                {React.createElement(RecipePreviewCard, {key: recipe.id, recipe: recipe})}
            </div>
        );

    }

    function searchForRecipe(e) {
        e.preventDefault()

        // Searching by name
        const names = searchQuery.current.value.toLowerCase().split(" ").filter(name =>
            // Filter out useless words
            (name !== "" && name !== "in" && name !== "a" && name !== "the" && name !== "and")
        )

        let tempRecipes = [];

        for (let i = 0; i < displayedRecipes.length; i++) {
            let recipeName = displayedRecipes[i].data.name;
            for (let i = 0; i < names.length; i++) {
                if (recipeName.toLowerCase().includes(names[i])) {
                    tempRecipes.push(displayedRecipes[i]);
                    break;
                }
            }
        }

        setDisplayedRecipes(tempRecipes);
    }

    function ShowLoggedOutSearch() {
        console.log(uid);
        if (uid !== null) {
            hideComponentsWhenLoggedOut('block');
            return "Search By Name";
        } else {
            // I'm doing it this weird way because I can't interact with a segmented control when
            //     it's generated conditional for some reason.
            hideComponentsWhenLoggedOut('none');
            return "Search by Name";
        }
    }

    useEffect(() => {
        // if (state !== undefined) {
        //     searchQuery.current.value = state;
        //
        // } else {
        //     searchQuery.current.value = "";
        // }

        getRecipes()

    }, []);

    return (
        <div className='contentInsets'>
            <div className='pageTitle'> Cookbook </div>

            <div style={{backgroundColor: 'steelblue', borderRadius: 15, padding: '1rem'}}>
                <div>{JSON.stringify(testOutput)}</div>
                <Container>
                    <div style={{color: 'white', textAlign: 'center', verticalAlign: 'bottom', fontWeight: 'bold', fontSize: 17,}}>
                        <ShowLoggedOutSearch/>
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
                                style={{ width: 600, display: segmentedControlHeight, color: 'grey', backgroundColor: 'white', borderColor: 'white', borderWidth: 4, borderRadius: '15px', fontSize: 15}} // purple400
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
                <Form className='leftContentInsets' style={{display: segmentedControlHeight}}>

                </Form>
            </div>
            <div className='leftAndRightContentInsets' style={{backgroundColor: 'lightgray', paddingTop: '1rem', borderRadius: '0px 0px 15px 15px'}}>
                {tableLabel.length ? <div style={{textAlign: 'center', fontSize: 20, paddingBottom: '1rem'}}>{tableLabel}</div> : <></>}
                {/*<div style={{paddingLeft: '1rem', paddingRight: '1rem'}}>{RecipePreviewCard("Turducken", [{name: "Turkey"}, {name: "Duck"}, {name: "Chicken"}, {name: "Chicken2"}, {name: "Chicken3"}, {name: "Chicken4"}])}</div>*/}
                <div>{updateResults()}</div>
            </div>

        </div>
    );

}
