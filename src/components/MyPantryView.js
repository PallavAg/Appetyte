import React, {useEffect, useState} from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import {Button, Form, Row, Col} from "react-bootstrap";
import { BsFillTrashFill } from 'react-icons/bs';
import firebase, {auth, db} from "../firebase";
import {useAuth} from "../contexts/AuthContext";
//import {update} from "firebase/firebase-database";



export default function MyPantryView() {
    const {uid} = useAuth();
    const [error, setError] = useState("");
    const [products, setProducts] = useState([]);
    const [futureIngredient, setFutureIngredient] = useState({name: "", expiration: ""});

    useEffect(()=>{
        getIngredients();
    }, []);

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
        db.collection("Users").doc(uid).collection("Pantry").get().then(ingredients => updateIngredients(ingredients.docs));
        try {
            let userId = auth.tenantId;

        } catch (err) {
            console.log(err.message)
        }
    }


    function addIngredient(e, name, expiration) {
        e.preventDefault();
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
        db.collection("Users").doc(uid).collection("Pantry").doc(name).set(docData).then(getIngredients, onError);
    }

    function onError(e) {
        setError(e.message);
    }

    function updateIngredients(ingredients) {
        let newIngredients = [];
        ingredients.forEach( (ingredient, index) => {
            newIngredients.push(
                {
                    id: index,
                    name: ingredient.id,
                    expiration: ingredient.data().expiration,
                    delete: <BsFillTrashFill onClick={(event) => deleteIngredient(event, ingredient.id)}/>
                }
            );
            }
        );
        console.log("Updating Ingredients");
        setProducts(newIngredients);
    }

    function setIngredients() {
        const index = 0;
        getIngredients();
        //setProducts(products => ([...products, { id: index, name: "Chicken", expiration: "eternal", delete: <BsFillTrashFill onClick={(event) => deleteIngredient(event, index)}/>}]))
    }

    function deleteIngredient(e, id) {
        e.preventDefault();
        //let ingredient = products[index];
        // let ingredient = products.find(item => item.id === index);
        // console.log(products);
        // console.log(ingredient);
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

    const selectRow = {
        mode: 'radio', // single row selection
        clickToSelect: true,
        selectColumnPosition: 'right'
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
                        data={products}
                        columns={columns}
                    />
                </div>
                {/*<button onClick={setIngredients}>Remove this button after add ingredient is implemented</button>*/}
                {/*Note: deleting one ingredient will delete them all since they are all currently created with the same ID*/}
            </div>
        </div>
    );
}

