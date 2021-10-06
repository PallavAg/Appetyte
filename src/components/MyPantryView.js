import React, {useState} from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import { Button } from 'react-bootstrap';
import { BsFillTrashFill } from 'react-icons/bs';
import firebase, {auth, db} from "../firebase";
import {useAuth} from "../contexts/AuthContext";
//import {update} from "firebase/firebase-database";



export default function MyPantryView() {
    const {uid} = useAuth();
    const [error, setError] = useState("");

    function getIngredients() {
        try {
            let userId = auth.tenantId;
            console.log(userId);
            db.collection("Users").doc(uid).collection("Pantry").get().then(ingredients => updateIngredients(ingredients));
        } catch (err) {
            console.log(err.message)
        }

    }

    const [products, setProducts] = useState([]);

    function addIngredient(e, name, expiration) {
        e.preventDefault();
        if (name ==="" || expiration === "") {
            return;
        }

        // DB code
        let docData = {expiration: expiration};
        db.collection("Users").doc(uid).collection("Pantry").doc(name).set(docData).then(getIngredients);
    }

    function updateIngredients(ingredients) {
        let newIngredients = [];
        let i=0;
        ingredients.forEach( ingredient => {
                console.log(ingredient)
                newIngredients.push(
                    {
                        id: i,
                        name: ingredient.id,
                        expiration: ingredient.data().expiration,
                        delete: <BsFillTrashFill onClick={(event) => deleteIngredient(event, i++)}/>
                    }
                )
            }
        );
        console.log(ingredients);
        setProducts(newIngredients);
    }

    function setIngredients() {
        const index = 0;
        getIngredients();
        //setProducts(products => ([...products, { id: index, name: "Chicken", expiration: "eternal", delete: <BsFillTrashFill onClick={(event) => deleteIngredient(event, index)}/>}]))
    }

    function deleteIngredient(e, index) {
        e.preventDefault();
        let ingredient = products.find(item => item.id === index)
        db.collection("Users").doc(uid).collection("Pantry").doc(ingredient.name).delete().then(getIngredients);

        // let copy = products.filter(item => item.id !== index)
        //
        // for (let i = 0; i < copy.length; i++) {
        //     if (copy[i].id > index) {
        //         copy[i].id--;
        //     }
        // }
        // setProducts(copy);
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
                    <button onClick={(event) => addIngredient(event, "Apple", "Yes")}>+</button>
                </div>
                <div style={{color: 'red', paddingTop: '1rem', fontSize: 17}}>{error}</div>
                <div>
                    <BootstrapTable
                        bootstrap4
                        keyField="id"
                        data={products}
                        columns={columns}
                    />
                </div>
                <button onClick={setIngredients}>Remove this button after add ingredient is implemented</button>
                Note: deleting one ingredient will delete them all since they are all currently created with the same ID
            </div>
        </div>
    );
}

