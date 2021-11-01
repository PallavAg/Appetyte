import React, {useEffect, useState, useRef} from "react"
import RecipePreviewCard from "./Subviews/RecipePreviewCard";
import {Container, Button, Form, Row, Col} from "react-bootstrap";
import { SegmentedControl } from 'segmented-control'
import {db} from "../firebase";
import { collection, query, where, getDocs, FieldPath, documentId} from "firebase/firestore"

import {useAuth} from "../contexts/AuthContext"

const SearchType = {
    INGREDIENTS_IN_MY_PANTRY: 0,
    INGREDIENTS: 1,
    NAME: 2,

}

export default function SearchPage() {

    const [segmentedCtrlState, setSegmentedCtrlState] = useState(0);

    const [recipes, setRecipes] = useState([]);
    const [tableLabel, setTableLabel] = useState("");

    const [segmentedControlHeight, hideComponentsWhenLoggedOut] = useState('block');

    // TODO: DELETE THIS
    const [testOutput, setTestOutput] = useState("");

    const searchQuery = useRef("");
    const [canContainNotInPantry, setCanContainNotInPantry] = useState(false);
    const [showRecipesOnlyInCookBook, setShowRecipesOnlyInCookBook] = useState(false);


    const {uid} = useAuth();

    function updateResults() {

        const items = recipes.map((recipe) =>
            <div style={{paddingLeft: '1rem', paddingRight: '1rem', paddingBottom: '1rem'}}>
                {RecipePreviewCard(recipe.name, recipe.coreIngredients)}
            </div>
        );
        return items;

    }

    async function searchForRecipe(e) {
        e.preventDefault();

        const recipesRef = collection(db, "Recipes");

        var tempRecipes = [];

        if (searchQuery.current.value === "" && segmentedCtrlState !== SearchType.INGREDIENTS_IN_MY_PANTRY) {
            setRecipes(tempRecipes);
            setTableLabel("Please enter search text");
            return;
        }

        const q = query(recipesRef, where("recipeType", "==", "Public"));

        // Note: I wanted to have a separate query like:
        //          q = query(recipesRef, where(documentId(), "in", cookBookRecipes))
        //       for when only looking at recipes in cookbook/saved. However, Firebase
        //       only supports in if the array is 10 or less elements :/
        //       Will have to filter out elements at end of search.

        const querySnapshot = await getDocs(q);
        let pantryQuerySnapshot;
        if (uid) {
            const pantryQ = query(collection(db, "Users", uid, "Pantry"));
            pantryQuerySnapshot = await getDocs(pantryQ);
        }

        let pantryIngredients = [];
        let pantryIngredientNames = [];

        if (segmentedCtrlState === SearchType.INGREDIENTS_IN_MY_PANTRY && uid) {
            // Searching by ingredients in their pantry

            pantryQuerySnapshot.forEach((doc) => {
                let name = doc.data()["name"];
                const expiration = doc.data()["expiration"];
                pantryIngredientNames.push(name.toLowerCase());
                // Adding map array with expiration date in case that can be used later to filter search query
                pantryIngredients.push({name: name.toLowerCase(), expiration: expiration});
            });

            let alreadyAdded = false;

            // Searching by ingredients
            querySnapshot.forEach((doc) => {
                const name = doc.data()["name"];
                const coreIngredients = doc.data()["coreIngredients"];
                const sideIngredients = doc.data()["sideIngredients"];

                // Create array of names.
                for (let i = 0; i < coreIngredients.length; i++) {

                    const coreMatch = (ingredient) => coreIngredients[i].name.toLowerCase().includes(ingredient);
                    if (pantryIngredientNames.some(coreMatch)) {
                        tempRecipes.push({name: name, coreIngredients: coreIngredients, id: doc.id});

                        alreadyAdded = true;
                        break;
                    }
                }

                if (!alreadyAdded) {
                    // We didn't already match a core ingredient
                    for (let i = 0; i < sideIngredients.length; i++) {
                        const sideMatch = (ingredient) => sideIngredients[i].name.toLowerCase().includes(ingredient);
                        if (pantryIngredientNames.some(sideMatch)) {
                            tempRecipes.push({name: name, coreIngredients: coreIngredients, id: doc.id});
                        }
                    }
                }
            });

        }
        else if (segmentedCtrlState === SearchType.INGREDIENTS && uid) {
            // TODO: Space separate and comma separate ingredients!
            // TODO: Make an acceptance criteria for this?

            // First remove strings separated by ", " then remove split by ","
            // This allows for the user to put "ingredient, ingredient" or "ingredient,ingredient"
            // This also allows preserves spaces in ingredients like "white pepper, gala apples"
            const tempString = searchQuery.current.value.toLowerCase().split(", ").join(",");
            let ingredients = tempString.split(',');
            setTestOutput(ingredients)
            let alreadyAdded = false;

            // Searching by ingredients
            querySnapshot.forEach((doc) => {
                const name = doc.data()["name"];
                const coreIngredients = doc.data()["coreIngredients"];
                const sideIngredients = doc.data()["sideIngredients"];
                for (let i = 0; i < coreIngredients.length; i++) {
                    const coreMatch = (ingredient) => coreIngredients[i].name.toLowerCase().includes(ingredient);
                    if (ingredients.some(coreMatch)) {
                        tempRecipes.push({name: name, coreIngredients: coreIngredients, id: doc.id});
                        alreadyAdded = true;
                        break;
                    }
                }

                if (!alreadyAdded) {
                    // We didn't already match a core ingredient
                    for (let i = 0; i < sideIngredients.length; i++) {
                        const sideMatch = (ingredient) => sideIngredients[i].name.toLowerCase().includes(ingredient);
                        if (ingredients.some(sideMatch)) {
                            tempRecipes.push({name: name, coreIngredients: coreIngredients, id: doc.id});
                        }
                    }
                }


            });

        }
        else if (segmentedCtrlState === SearchType.NAME || !uid) {
            // Searching by name
            // The only method allowed when the user is logged out
            querySnapshot.forEach((doc) => {
                let name = doc.data()["name"];
                let coreIngredients = doc.data()["coreIngredients"];
                if (name.toLowerCase().includes(searchQuery.current.value.toLowerCase())) {
                    tempRecipes.push({name: name, coreIngredients: coreIngredients, id: doc.id});
                }
            });

        }

        if (showRecipesOnlyInCookBook && uid) {
            // Take out recipes that are not part of their cookbook
            const cookBookRecipes = []

            // TODO: Test when the user has no created or saved recipes, i.e. these collections don't exist
            const qCookbook = query(collection(db, "Users", uid, "CreatedRecipes"));
            const cookbookSnapshot = await getDocs(qCookbook);
            cookbookSnapshot.forEach((doc) => {
                cookBookRecipes.push(doc.id);
            });
            const qSaved = query(collection(db, "Users", uid, "SavedRecipes"))
            const savedRecipesSnapshot = await getDocs(qSaved);
            savedRecipesSnapshot.forEach((doc) => {
                cookBookRecipes.push(doc.id)
            });

            tempRecipes = tempRecipes.filter(recipe =>
                ((cookBookRecipes.includes(recipe.id)) === true)
            );
        }

        if (!canContainNotInPantry && uid) {
            // Check if recipes can contain ingredients outside what I have in my pantry

            let filteredRecipes = [];

            tempRecipes.forEach(element => {
                let keepRecipe = true;
                for (let i = 0; i < element.coreIngredients.length; i++) {
                    if (!pantryIngredients.includes(element.coreIngredients[i].name)) {
                        // Core ingredient missing from the pantry
                        keepRecipe = false;
                        break;
                    }
                }

                if (keepRecipe) {
                    for (let i = 0; i < element.sideIngredients.length; i++) {
                        if (!pantryIngredients.includes(element.sideIngredients[0].name)) {
                            // Side ingredient missing from the pantry
                            keepRecipe = false;
                            break;
                        }
                    }

                    if (keepRecipe) {
                        // Recipe can be added to returned results
                        filteredRecipes.push(element);
                    }
                }
            });

            tempRecipes = filteredRecipes;
        }

        //setTestRecipeName(recipes[0])
        if (tempRecipes.length === 0) {
            setTableLabel("No Results");
        } else {
            setTableLabel("");
        }
        setRecipes(tempRecipes);

    }

    function ShowLoggedOutSearch() {
        if (uid !== null) {
            hideComponentsWhenLoggedOut('block');
            return "Search By";
        } else {
            // I'm doing it this weird way because I can't interact with a segmented control when
            //     it's generated conditional for some reason.
            hideComponentsWhenLoggedOut('none');
            return "Search by Name";
        }
    }

    useEffect(() => {
        //searchForRecipe()
    });

    return (
        <div className='contentInsets'>
            <div className='pageTitle'>Search Recipes</div>
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
                                    { label: "Ingredients in My Pantry", value: 0, default: true },
                                    { label: "Any Ingredients", value: 1 },
                                    { label: "Name", value: 2},
                                ]}
                                setValue={newValue => setSegmentedCtrlState(newValue)}
                                style={{ width: 600, display: segmentedControlHeight, color: 'grey', backgroundColor: 'white', borderColor: 'white', borderWidth: 4, borderRadius: '15px', fontSize: 15}} // purple400
                            />
                        </Col>
                        <Col>
                        </Col>
                    </Row>
                </Container>
                <Form>
                    <Form.Group className="mb-3" controlId="search">
                        <Row>
                            <Col>
                                <Form.Control
                                    type="name"
                                    placeholder={"Search"}
                                    ref={searchQuery}
                                    //id={id}
                                    //onChange={e => setField('name', e.target.value, id, 3)}
                                />
                            </Col>
                            <Col md="auto">
                                <Button style={{borderRadius: 5, color: 'black', backgroundColor: 'lightgray', borderColor: 'lightgray'}} type='submit' onClick={e => searchForRecipe(e)}>Search</Button>
                            </Col>
                        </Row>

                    </Form.Group>
                </Form>
                <Form className='leftContentInsets' style={{display: segmentedControlHeight}}>
                    <Form.Group className="mb-3" style={{color: 'white'}}>
                        <Form.Check type="checkbox" label="Can contain ingredients not my in pantry" onChange={e => {
                            setCanContainNotInPantry(e.target.checked);
                        }
                        }/>
                        <Form.Check type="checkbox" label="Show only recipes in my cookbook" onChange={e => {
                            setShowRecipesOnlyInCookBook(e.target.checked);
                        }
                        }/>
                    </Form.Group>
                </Form>
            </div>
            <div className='leftAndRightContentInsets' style={{backgroundColor: 'lightgray', paddingTop: '1rem', paddingBottom: '1rem'}}>
                <div style={{textAlign: 'center', fontSize: 20}}>{tableLabel}</div>
                {/*<div style={{paddingLeft: '1rem', paddingRight: '1rem'}}>{RecipePreviewCard("Turducken", [{name: "Turkey"}, {name: "Duck"}, {name: "Chicken"}, {name: "Chicken2"}, {name: "Chicken3"}, {name: "Chicken4"}])}</div>*/}
                <div>{updateResults()}</div>
            </div>

        </div>
    );

}
