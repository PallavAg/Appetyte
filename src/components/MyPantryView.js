import React, {useState, useEffect} from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import {Button, Form, Row, Col} from "react-bootstrap";
import { BsFillTrashFill } from 'react-icons/bs';
import firebase, {auth, db} from "../firebase";
import {useAuth} from "../contexts/AuthContext";
import { doc, getDoc, collection, query, getDocs } from "firebase/firestore";
import {getFirestore} from "firebase/firestore";
import {initializeApp} from "firebase/app";
import {Link} from "react-router-dom";
//import {list} from "firebase/firebase-storage";


export default function MyPantryView() {
    const {uid} = useAuth();
    const [error, setError] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [futureIngredient, setFutureIngredient] = useState({name: "", expiration: "", category: ""});
    const [ingredientNames, setIngredientNames] = useState([]);
    const [ingredientExpirations, setIngredientExpirations] = useState([]);
    const [ingredientCategories, setIngredientCategories] = useState([]);
    const [checked, setChecked] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);

    useEffect(()=>{
        getIngredients();
    }, []);

    function setField(field, value) {
        let copyIngredient = futureIngredient;
        if (field === "name") {
            copyIngredient.name = value;
        } else if (field === "expiration") {
            copyIngredient.expiration = value;
        } else if (field === "category") {
            copyIngredient.category = value;
        }
        setFutureIngredient(copyIngredient);
    }

    function getIngredients() {
        if (uid === null) {
            setError("You must be logged in to set and see your ingredients!");
            return;
        }

        // Query only those with the specified category
        if (filterCategory.length > 0) {
            db.collection("Users").doc(uid).collection("Pantry").where("category","==",filterCategory).get().then(ingredients => updateIngredients(ingredients.docs), e => setError(e.message));
        } else {
            db.collection("Users").doc(uid).collection("Pantry").get().then(ingredients => updateIngredients(ingredients.docs), e => setError(e.message));
        }
    }


    function addIngredient(e, name, expiration, category) {
        e.preventDefault();

        if (uid === null) {
            setError("You must be logged in to set and see your ingredients!");
            return;
        }

        if (name === "") {
            setError("Your ingredient needs a name!");
            return;
        }
        if (expiration === "") {
            setError("Your ingredient needs an expiration!");
            return;
        }
        setError("");

        // DB code
        let docData = {name: name, expiration: expiration};
        if (category.length > 0) {
            docData.category = category;
        }
        db.collection("Users").doc(uid).collection("Pantry").add(docData).then(getIngredients, e => setError(e.message));
    }

    function updateIngredients(ingredients) {
        let newIngredients = [];
        let newExpirations = [];
        let newCategories = [];
        ingredients.forEach( (ingredient, index) => {
                newIngredients.push(
                    {
                        id: index,
                        name: ingredient.data().name,
                        expiration: ingredient.data().expiration,
                        category: (ingredient.data().category && ingredient.data().category.length > 0) ? ingredient.data().category : "-",
                        delete: <BsFillTrashFill onClick={(event) => deleteIngredient(event, ingredient.id)}/>,
                        select: <input
                            type="checkbox"
                            value={checked}
                            //onClick={handleChange(this.node.selectionContext.selected)}
                        />,
                        firebaseID: ingredient.id
                    }
                );
            }
        );
        setIngredientNames(newIngredients);
        setIngredientExpirations(newExpirations);
        setIngredientCategories(newCategories);
    }

    function deleteIngredient(e, id) {
        e.preventDefault();
        //let ingredient = products[index];
        // let ingredient = products.find(item => item.id === index);
        // console.log(products);
        // console.log(ingredient);
        if (uid === null) {
            setError("You must be logged in to set and see your ingredients!");
            return;
        }
        db.collection("Users").doc(uid).collection("Pantry").doc(id).delete().then(getIngredients);
    }

    const columns = [
        {
            dataField: "name",
            text: "Ingredient",
            sort: true
        },
        {
            dataField: "expiration",
            text: "Expires in",
            sort: true
        },
        {
            dataField: "category",
            text: "Category"
        },
        {
            dataField: "delete",
            text: "Delete"
        }
    ];

    const selectRow = {
        mode: 'checkbox', // single row selection
        clickToSelect: true,
        onSelect: (row, isSelect, rowIndex, e) => {
            if (isSelect) {
                // not in selected Ingredients
                if (selectedIngredients.indexOf(row.name) == -1) {
                    setSelectedIngredients([...selectedIngredients, row.name])
                }
            } else {
                setSelectedIngredients(selectedIngredients.filter((x) => x !== row.name));
            }
        },
        onSelectAll: (isSelect, rows, e) => {
            if (isSelect) {
                setSelectedIngredients(rows.map((row) => row.name))
            } else {
                setSelectedIngredients([]);
            }
        }
    };

    return (
        <div className='MyPantryView'>
            <div className='contentInsets'>
                <div className='pageTitle'>
                    My Pantry
                    <span style={{padding: 10}} /* This is blocking the Nav Bar Buttons */ />

                </div>
                <div style={{color: 'red', paddingTop: '1rem', fontSize: 17}}>{error}</div>
                <div>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Row>
                                <Col sm={5}>
                                    <Form.Control
                                        type="name"
                                        placeholder={"Ingredient"}
                                        onChange={e => setField('name', e.target.value)}
                                    />
                                </Col>
                                <Col sm={3}>
                                    <Form.Control
                                        type="expiration"
                                        placeholder={"Expiration"}
                                        onChange={e => setField('expiration', e.target.value)}
                                    />
                                </Col>
                                <Col sm={3}>
                                    <Form.Control
                                        type="category"
                                        placeholder={"Category"}
                                        onChange={e => setField('category', e.target.value)}
                                    />
                                </Col>
                                <Col>
                                    <Button onClick={(event) => addIngredient(event, futureIngredient.name, futureIngredient.expiration, futureIngredient.category)}>+</Button>
                                </Col>
                            </Row>
                        </Form.Group>
                    </Form>
                </div>
                <div style={{paddingBottom: "15px"}}>
                    <Form>
                        <Form.Group>
                            <Row>
                                <Col sm={6}>
                                    <Form.Control
                                        type="category"
                                        placeholder={"Filter by Category..."}
                                        onChange={e => setFilterCategory(e.target.value)}
                                    />
                                </Col>
                                <Col>
                                    <Button onClick={(event) => getIngredients()}>Filter Ingredients</Button>
                                </Col>
                            </Row>
                        </Form.Group>
                    </Form>
                </div>
                <div>
                    <BootstrapTable
                        bootstrap4
                        keyField="id"
                        data={ingredientNames}
                        selectRow={selectRow}
                        columns={columns}
                    />
                </div>
                <div>
                    <Link to={{ pathname: `/search`, state: selectedIngredients.toString()}}>
                        <Button>Search </Button>
                    </Link >
                </div>
                {/*<button onClick={setIngredientNames}>Remove this button after add ingredient is implemented</button>*/}
                {/*Note: deleting one ingredient will delete them all since they are all currently created with the same ID*/}
            </div>
        </div>
    );
}