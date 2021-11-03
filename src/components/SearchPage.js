import React, {useEffect, useState, useRef} from "react"
import RecipePreviewCard from "./Subviews/RecipePreviewCard";
import {Container, Button, Form, Row, Col} from "react-bootstrap";
import { SegmentedControl } from 'segmented-control'
import {db} from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore"

import {useAuth} from "../contexts/AuthContext"
import {Link, useLocation} from "react-router-dom";

const SearchType = {
    INGREDIENTS_IN_MY_PANTRY: 0,
    INGREDIENTS: 1,
    NAME: 2,

}

export default function SearchPage(searchData = "") {

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
    const [testOutput, setTestOutput] = useState(searchData);

    const searchQuery = useRef("");
    // Show recipes with ingredeints outside what's in the user's pantry
    const [canContainNotInPantry, setCanContainNotInPantry] = useState(false);
    // Show only recipes that are in the users cookbook
    const [showRecipesOnlyInCookBook, setShowRecipesOnlyInCookBook] = useState(false);
    // Show only ingredients that are listed in the search or fewer
    const [containsOnlyIngredientsInSearch, setContainsOnlyIngredientsInSearch] = useState(false);
    // Sort results
    const [sortResults, setSortResults] = useState(false);

    const {uid} = useAuth();


    function updateResults() {

        let finalRecipesList = recipes; // Needed to preserve unsorted list

        if (sortResults) {
            // Calculate votes for each recipe
            recipes.forEach((recipe) => {
                let count = recipe.data.upvotedList?.length - recipe.data.downvotedList?.length
                recipe["votes"] = isNaN(count) ? 0 : count
            })
            finalRecipesList = [...recipes].sort((a, b) => b.votes - a.votes)
        }

        return finalRecipesList.map((recipe) =>
            <div style={{paddingLeft: '1rem', paddingRight: '1rem', paddingBottom: '1rem'}}>
                {React.createElement(RecipePreviewCard, {key: recipe.id, id: recipe.id, recipe: recipe.data, interactiveElement: 'flex'})}
            </div>
        );

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
                        tempRecipes.push({name: name, coreIngredients: coreIngredients, sideIngredients: sideIngredients, id: doc.id, data: doc.data()}); // @
                        // @Ben, future template:
                        // tempRecipes.push({id: doc.id, data: doc.data()});
                        alreadyAdded = true;
                        break;
                    }
                }

                if (!alreadyAdded) {
                    // We didn't already match a core ingredient
                    for (let i = 0; i < sideIngredients.length; i++) {
                        const sideMatch = (ingredient) => sideIngredients[i].name.toLowerCase().includes(ingredient);
                        if (pantryIngredientNames.some(sideMatch)) {
                            tempRecipes.push({name: name, coreIngredients: coreIngredients, sideIngredients: sideIngredients, id: doc.id, data: doc.data()}); // @
                        }
                    }
                }
            });

        }
        else if (segmentedCtrlState === SearchType.INGREDIENTS && uid) {
            // TODO: Space separate and comma separate ingredients

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
                        tempRecipes.push({name: name, coreIngredients: coreIngredients, sideIngredients: sideIngredients, id: doc.id, data: doc.data()}); // @
                        alreadyAdded = true;
                        break;
                    }
                }

                if (!alreadyAdded) {
                    // We didn't already match a core ingredient
                    for (let i = 0; i < sideIngredients.length; i++) {
                        const sideMatch = (ingredient) => sideIngredients[i].name.toLowerCase().includes(ingredient);
                        if (ingredients.some(sideMatch)) {
                            tempRecipes.push({name: name, coreIngredients: coreIngredients, sideIngredients: sideIngredients, id: doc.id, data: doc.data()}); // @
                        }
                    }
                }

            });

            if (containsOnlyIngredientsInSearch) {
                // Recipe can only contain the ingredients that were searched
                let filteredRecipes = [];

                tempRecipes.forEach(element => {
                    let keepRecipe = true;
                    for (let i = 0; i < element.coreIngredients.length; i++) {
                        if (!ingredients.includes(element.coreIngredients[i].name)) {
                            // Core ingredient missing from the search
                            keepRecipe = false;
                            break;
                        }
                    }

                    if (keepRecipe) {
                        for (let i = 0; i < element.sideIngredients.length; i++) {
                            if (!ingredients.includes(element.sideIngredients[0].name)) {
                                // Side ingredient missing from the search
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

        }
        else if (segmentedCtrlState === SearchType.NAME || !uid) {
            // Searching by name
            // The only method allowed when the user is logged out
            const names = searchQuery.current.value.toLowerCase().split(" ").filter(name =>
                // Filter out useless words
                (name !== "" && name !== "in" && name !== "a" && name !== "the" && name !== "and")
            )

            querySnapshot.forEach((doc) => {
                let name = doc.data()["name"];
                let coreIngredients = doc.data()["coreIngredients"];
                for (let i = 0; i < names.length; i++) {
                    if (name.toLowerCase().includes(names[i])) {
                        tempRecipes.push({name: name, coreIngredients: coreIngredients, id: doc.id, data: doc.data()}); // @
                        break;
                    }
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
        if (state !== undefined) {
            searchQuery.current.value = state;

        } else {
            searchQuery.current.value = "";
        }

    }, []);

    function changeSegmentedControl(newValue) {
        if (newValue === SearchType.INGREDIENTS_IN_MY_PANTRY) {
            setHideNotInPantry('block');
            setHideNotListedIngredients('none');
            setHideSearchBar('none');
        }
        else if (newValue === SearchType.INGREDIENTS) {
            setHideNotInPantry('block');
            setHideNotListedIngredients('block');
            setHideSearchBar('block');
        } else if (newValue === SearchType.NAME) {
            setHideNotInPantry('block');
            setHideNotListedIngredients('none');
            setHideSearchBar('block');
        }
        setSegmentedCtrlState(newValue)
    }

    return (
        <div className='contentInsets'>
            <div className='pageTitle'>Search Recipes</div>

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
                                    { label: "Ingredients in My Pantry", value: 0},
                                    { label: "Any Ingredients", value: 1, default: true },
                                    { label: "Name", value: 2},
                                ]}

                                setValue={newValue => changeSegmentedControl(newValue)}
                                style={{ width: 600, display: segmentedControlHeight, color: 'grey', backgroundColor: 'white', borderColor: 'white', borderWidth: 4, borderRadius: '20px', fontSize: 15}} // purple400
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
                        <Button style={{borderRadius: 5, float: 'center', color: 'black', backgroundColor: 'lightgray', borderColor: 'lightgray'}}
                                type='submit'   // This makes it search when you hit enter
                                onClick={e => searchForRecipe(e)}>Search</Button>
                    </Form.Group>
                </Form>
                <Form className='leftContentInsets' style={{display: segmentedControlHeight}}>
                    <Form.Group className="mb-3" style={{color: 'white'}}>
                        <Form.Check type="checkbox"
                                    label="Can contain ingredients not my in pantry as well"
                                    style={{display: hideNotInPantry}}
                                    onChange={e => {
                            setCanContainNotInPantry(e.target.checked);
                        }
                        }/>
                        <Form.Check type="checkbox"
                                    label="Contains only ingredients listed in search or fewer"
                                    style={{display: hideNotListedIngredients}}
                                    onChange={e => {
                            setContainsOnlyIngredientsInSearch(e.target.checked)
                        }
                        }/>
                        <Form.Check type="checkbox" label="Show only recipes in my cookbook" onChange={e => {
                            setShowRecipesOnlyInCookBook(e.target.checked);
                        }
                        }/>
                        <Form.Check type="checkbox" label="Sort recipes by votes" onChange={e => {
                            setSortResults(e.target.checked);
                        }
                        }/>
                    </Form.Group>
                </Form>
            </div>
            <div className='leftAndRightContentInsets' style={{backgroundColor: 'lightgray', paddingTop: '1rem', borderRadius: '0px 0px 15px 15px'}}>
                {tableLabel.length ? <div style={{textAlign: 'center', fontSize: 20, paddingBottom: '1rem'}}>{tableLabel}</div> : <></>}
                <div>{updateResults()}</div>
            </div>

        </div>
    );

}
