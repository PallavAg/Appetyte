import React, {useEffect, useState, useRef} from "react"
import RecipePreviewCard from "./Subviews/RecipePreviewCard";
import {Container, Button, Form, Row, Col} from "react-bootstrap";
import { SegmentedControl } from 'segmented-control'
import {db} from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore"
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

    const [segmentedControlHeight, setSegmentedControlHeight] = useState(45);
    const [segmentedBorderWidth, setSegmentedBorderWidth] = useState(4);

    // TODO: DELETE THIS
    const [testOutput, setTestOutput] = useState("");

    const searchQuery = useRef("");

    const {uid, getUnverifiedUID} = useAuth();

    function updateResults() {

        const items = recipes.map((recipe) =>
            <div style={{paddingLeft: '1rem', paddingRight: '1rem'}}>
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
        const querySnapshot = await getDocs(q);

        if (segmentedCtrlState === SearchType.INGREDIENTS_IN_MY_PANTRY) {

            // Searching by ingredients in their pantry

            const pantryQ = query(collection(db, "Users", uid, "Pantry"));
            const pantryQuerySnapshot = await getDocs(pantryQ);

            let pantryIngredients = [];
            let pantryIngredientNames = [];

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
        else if (segmentedCtrlState === SearchType.INGREDIENTS) {
            // TODO: Space separate and comma separate ingredients!
            // TODO: Make an acceptance criteria for this?

            let ingredients = [searchQuery.current.value.toLowerCase()];
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
        else if (segmentedCtrlState === SearchType.NAME) {
            // Searching by name
            querySnapshot.forEach((doc) => {
                let name = doc.data()["name"];
                let coreIngredients = doc.data()["coreIngredients"];
                if (name.toLowerCase().includes(searchQuery.current.value.toLowerCase())) {
                    tempRecipes.push({name: name, coreIngredients: coreIngredients, id: doc.id});
                }

            });

        }

        // Check if recipes cannot contain ingredients outside what I have on hand

        // Check if should only search for recipes in my cookbook

        //setTestRecipeName(recipes[0])
        if (tempRecipes.length === 0) {
            setTableLabel("No Results");
        }
        setRecipes(tempRecipes);

    }

    function ShowLoggedOutSearch() {
        if (uid !== null) {
            setSegmentedControlHeight(45);
            setSegmentedBorderWidth(4);
            return "Search By";
        } else {
            // I'm doing it this weird way because I can't interact with a segmented control when
            //     it's generated conditional for some reason.
            setSegmentedControlHeight(0);
            setSegmentedBorderWidth(0);
            return "Search by Name";
        }
    }

    function ShowSearchOptions() {
        if (uid !== null) {
            return <Form className='leftContentInsets'>
                <Form.Group className="mb-3" controlId="formBasicCheckbox" style={{color: 'white'}}>
                    <Form.Check type="checkbox" label="Can contain ingredients not my in pantry" />
                    <Form.Check type="checkbox" label="Show only recipes in my cookbook" />
                </Form.Group>
            </Form>
        } else {
            return <div></div>
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
                                style={{ width: 600, height: segmentedControlHeight, color: 'grey', backgroundColor: 'white', borderColor: 'white', borderWidth: segmentedBorderWidth, borderRadius: '15px', fontSize: 15}} // purple400
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
                                <Button style={{borderRadius: 5, color: 'black', backgroundColor: 'lightgray', borderColor: 'lightgray'}} onClick={e => searchForRecipe(e)}>Search</Button>
                            </Col>
                        </Row>

                    </Form.Group>
                </Form>
                <ShowSearchOptions/>
            </div>
            <div className='leftAndRightContentInsets' style={{backgroundColor: 'lightgray', paddingTop: '1rem', paddingBottom: '1rem'}}>
                <div style={{textAlign: 'center', fontSize: 20}}>{tableLabel}</div>
                {/*<div style={{paddingLeft: '1rem', paddingRight: '1rem'}}>{RecipePreviewCard("Turducken", [{name: "Turkey"}, {name: "Duck"}, {name: "Chicken"}, {name: "Chicken2"}, {name: "Chicken3"}, {name: "Chicken4"}])}</div>*/}
                <div>{updateResults()}</div>
            </div>

        </div>
    );

}
