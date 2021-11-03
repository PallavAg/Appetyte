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

    const [segmentedCtrlState, setSegmentedCtrlState] = useState(1);

    const [recipes, setRecipes] = useState([]);
    const [tableLabel, setTableLabel] = useState("");
    const { state } = useLocation();

    // Show the segmented control
    const [segmentedControlHeight, hideComponentsWhenLoggedOut] = useState('block');
    // Show the 'Can contain ingredients not my in pantry as well' checkbox
    const [hideNotInPantry, setHideNotInPantry] = useState('block');
    // Show the 'Contains only ingredients listed in search or fewer' checkbox
    const [hideNotListedIngredients, setHideNotListedIngredients] = useState('block');
    // Show the search bar
    const [hideSearchBar, setHideSearchBar] = useState('block');


    // TODO: DELETE THIS
    //const [testOutput, setTestOutput] = useState(searchData);

    const searchQuery = useRef("");
    // Show recipes with ingredeints outside what's in the user's pantry
    const [canContainNotInPantry, setCanContainNotInPantry] = useState(false);
    // Show only recipes that are in the users cookbook
    const [showRecipesOnlyInCookBook, setShowRecipesOnlyInCookBook] = useState(false);
    // Show only ingredients that are listed in the search or fewer
    const [containsOnlyIngredientsInSearch, setContainsOnlyIngredientsInSearch] = useState(false);

    const {uid} = useAuth();
    console.log(uid);

    async function getRecipes() {
        console.log("get recipes");
        var tempRecipes = [];
        const cookBookRecipes = []

        // TODO: Test when the user has no created or saved recipes, i.e. these collections don't exist
        if (SearchType.CREATED) {
            const qCookbook = query(collection(db, "Users", uid, "CreatedRecipes"));
            const cookbookSnapshot = await getDocs(qCookbook);
            cookbookSnapshot.forEach((doc) => {
                cookBookRecipes.push(doc.id);
            });
        } else if (SearchType.SAVED) {
            const qSaved = query(collection(db, "Users", uid, "SavedRecipes"))
            const savedRecipesSnapshot = await getDocs(qSaved);
            savedRecipesSnapshot.forEach((doc) => {
                cookBookRecipes.push(doc.id)
            });
        }
        tempRecipes = cookBookRecipes
        console.log(tempRecipes);
        setRecipes(tempRecipes);
    }


    function updateResults() {
        console.log("update results");
        let promise = getRecipes().then();
        console.log("after promise");
        // 'recipe' should contain id, name, coreIngredients
        return recipes.map((recipe) =>
            <div style={{paddingLeft: '1rem', paddingRight: '1rem', paddingBottom: '1rem'}}>
                {React.createElement(RecipePreviewCard, {key: recipe.id, recipe: recipe})}
            </div>
        );

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
        if (state !== undefined) {
            searchQuery.current.value = state;

        } else {
            searchQuery.current.value = "";
        }

    }, []);

    return (
        <div className='contentInsets'>
            <div className='pageTitle'> Cookbook </div>

            <div style={{backgroundColor: 'steelblue', borderRadius: 15, padding: '1rem'}}>
                {/*<div>{JSON.stringify(testOutput)}</div>*/}
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

                                //setValue={newValue => changeSegmentedControl(newValue)}
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
