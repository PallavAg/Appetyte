import React, {useState} from "react"
import RecipePreviewCard from "./Subviews/RecipePreviewCard";
import {Container, Button, Form, Row, Col} from "react-bootstrap";
import { SegmentedControl } from 'segmented-control'
import {db} from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore"

const SearchType = {
    NAME: 0,
    INGREDIENTS_IN_MY_PANTRY: 1,
    INGREDIENTS: 2
}

export default function SearchPage() {

    const [segmentedCtrlState, setSegmentedCtrlState] = useState(0);

    async function searchForRecipe(searchQuery, containsOnlySelectedIngredients = false) {
        const recipesRef = collection(db, "Recipes");

        var recipes = []

        if (segmentedCtrlState == SearchType.INGREDIENTS_IN_MY_PANTRY) {
            // Searching by ingredients in their pantry

            const q1 = query(recipesRef, where(searchQuery, "in", "coreIngredients"))
            const q2 = query(recipesRef, where(searchQuery, "in", "sideIngredients"))

            // Merge into single collection removing duplicates

            // Remove any recipes that have ingredients that aren't in the pantry

        }
        else if (segmentedCtrlState == SearchType.INGREDIENTS) {
            // Searching by ingredients

            const q1 = query(recipesRef, where(searchQuery, "in", "coreIngredients"))
            const q2 = query(recipesRef, where(searchQuery, "in", "sideIngredients"))

            // Merge into single collection removing duplicates

        }
        else if (segmentedCtrlState == SearchType.NAME) {
            // Searching by name
            const q = query(recipesRef, where(searchQuery, "in", "recipeName"))
            const querySnapshot = await getDocs(q);

        }

        // Check if recipes cannot contain ingredients outside what I have on hand

        // Check if should only search for recipes in my cookbook


        return recipes
    }

    return (
        <div className='contentInsets'>
            <div className='pageTitle'>Search Recipes</div>
            <div style={{backgroundColor: 'steelblue', borderRadius: 15, padding: '1rem'}}>
                <Container>
                    <Row>
                        <Col style={{color: 'white', textAlign: 'right', verticalAlign: 'bottom', lineHeight: 4, fontWeight: 'bold', fontSize: 17}}>
                            Search by:
                        </Col>
                        <Col>
                            <SegmentedControl // Using container in order to center the segmented control
                                name="oneDisabled"
                                options={[
                                    { label: "Ingredients in My Pantry", value: 0, default: true },
                                    { label: "Any Ingredients", value: 1 },
                                    { label: "Name", value: 2 },
                                ]}
                                setValue={newValue => setSegmentedCtrlState(newValue)}
                                style={{ width: 600, height: 45, color: 'grey', backgroundColor: 'white', borderColor: 'white', borderWidth: 4, borderRadius: '15px', fontSize: 15}} // purple400
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
                                    //id={id}
                                    //onChange={e => setField('name', e.target.value, id, 3)}
                                />
                            </Col>
                            <Col md="auto">
                                <Button style={{borderRadius: 5, color: 'black', backgroundColor: 'lightgray', borderColor: 'lightgray'}}>Search</Button>
                            </Col>
                        </Row>

                    </Form.Group>
                </Form>
                <Form className='leftContentInsets'>
                    <Form.Group className="mb-3" controlId="formBasicCheckbox" style={{color: 'white'}}>
                        <Form.Check type="checkbox" label="Can contain ingredients not my in pantry" />
                        <Form.Check type="checkbox" label="Show only recipes in my cookbook" />
                    </Form.Group>
                </Form>
            </div>
            <div className='leftAndRightContentInsets' style={{backgroundColor: 'lightgray', paddingTop: '1rem', paddingBottom: '1rem'}}>

                <div style={{paddingLeft: '1rem', paddingRight: '1rem'}}>{RecipePreviewCard("Turducken", [{name: "Turkey"}, {name: "Duck"}, {name: "Chicken"}, {name: "Chicken2"}, {name: "Chicken3"}, {name: "Chicken4"}])}</div>


            </div>

        </div>
    );

}
