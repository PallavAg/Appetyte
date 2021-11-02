import React, {useState, useEffect} from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import {Button, Form, Row, Col} from "react-bootstrap";
import { BsFillTrashFill } from 'react-icons/bs';
import firebase, {auth, db} from "../firebase";
import {useAuth} from "../contexts/AuthContext";
import { doc, getDoc, collection, query, getDocs } from "firebase/firestore";
import {getFirestore} from "firebase/firestore";
import {initializeApp} from "firebase/app";
//import {list} from "firebase/firebase-storage";


export default function MyPantryView() {
    const {uid} = useAuth();
    const [error, setError] = useState("");
    const [futureIngredient, setFutureIngredient] = useState({name: "", expiration: ""});
    const [ingredientNames, setIngredientNames] = useState([]);
    const [ingredientExpirations, setIngredientExpirations] = useState([]);
    const [checked, setChecked] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);

    useEffect(()=>{
        getIngredients();
    }, []);

    function handleChange() {
        console.log("clicked search");
    }

    function setField(field, value) {
        let copyIngredient = futureIngredient;
        if (field === "name") {
            copyIngredient.name = value;
        } else if (field === "expiration") {
            copyIngredient.expiration = value;
        }
        setFutureIngredient(copyIngredient);
    }

    function getIngredients() {
        if (uid === null) {
            setError("You must be logged in to set and see your ingredients!");
            return;
        }
        db.collection("Users").doc(uid).collection("Pantry").get().then(ingredients => updateIngredients(ingredients.docs), e => setError(e.message));
        try {
            let userId = auth.tenantId;

        } catch (err) {
            setError(err.message);
            console.log(err.message);
        }
    }


    function addIngredient(e, name, expiration) {
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
        let docData = {expiration: expiration};
        db.collection("Users").doc(uid).collection("Pantry").doc(name).set(docData).then(getIngredients, e => setError(e.message));
    }

    function updateIngredients(ingredients) {
        let newIngredients = [];
        let newExpirations = [];
        ingredients.forEach( (ingredient, index) => {
                newIngredients.push(
                    {
                        id: index,
                        name: ingredient.id,
                        expiration: ingredient.data().expiration,
                        delete: <BsFillTrashFill onClick={(event) => deleteIngredient(event, ingredient.id)}/>,
                        select: <input
                            type="checkbox"
                            value={checked}
                            //onClick={handleChange(this.node.selectionContext.selected)}
                        />
                    }
                );
            }
        );
        setIngredientNames(newIngredients);
        setIngredientExpirations(newExpirations);
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
            dataField: "delete",
            text: "Delete"
        }
    ];

    function handleClick() {
        console.log(selectedIngredients.toString());
    }

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
                                <Col sm={5}>
                                    <Form.Control
                                        type="expiration"
                                        placeholder={"Expiration"}
                                        onChange={e => setField('expiration', e.target.value)}
                                    />
                                </Col>
                                <Col>
                                    <button onClick={(event) => addIngredient(event, futureIngredient.name, futureIngredient.expiration)}>+</button>
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
                    <button onClick={handleClick}>
                        Search
                    </button>
                </div>
                {/*<button onClick={setIngredientNames}>Remove this button after add ingredient is implemented</button>*/}
                {/*Note: deleting one ingredient will delete them all since they are all currently created with the same ID*/}
            </div>
        </div>
    );
}