import React, {useState, useEffect} from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import { Button } from 'react-bootstrap';
import { BsFillTrashFill } from 'react-icons/bs';
import firebase from "../firebase";
import {useAuth} from "../contexts/AuthContext";
import { doc, getDoc, collection, query, getDocs } from "firebase/firestore";
import {getFirestore} from "firebase/firestore";
import {initializeApp} from "firebase/app";



export default function MyPantryView() {

    const [error, setError] = useState("");
    const {uid} = useAuth();
    const [ingredientNames, setIngredientNames] = useState([]);
    const [ingredientExpirations, setIngredientExpirations] = useState([]);

    useEffect(() => {
        getIngredients();
    }, []);

    async function getIngredients() {

        // if (!uid) {
        //     setError("User not logged in.")
        //     return;
        // }

        try {
            // TODO: Move from here

            const firebaseConfig = {
                apiKey: "AIzaSyCqsDGSsqBVbApAf86ypvwLxP0qAmgH1-I",
                authDomain: "appetyte-7a6f6.firebaseapp.com",
                projectId: "appetyte-7a6f6",
                storageBucket: "appetyte-7a6f6.appspot.com",
                messagingSenderId: "470203778412",
                appId: "1:470203778412:web:5a5f9976d8081213a01f49",
                measurementId: "G-E8RDH36LL3"
            };

            const app = initializeApp(firebaseConfig);
            const db = getFirestore(app);

            // TODO: GET USER ID
            const pantryRef = collection(db, "Users", "I003q2hhTK4RT80uW5AA", "Pantry")
            const q = query(pantryRef);
            const querySnapshot = await getDocs(q);
            let ingredients = []
            let expirations = []
            let index = 0;
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                ingredients.push({id: index, name: doc.id, expiration: doc.data()["expiration"].toString(), delete: <BsFillTrashFill onClick={(event) => deleteIngredient(event, index)}/>});
                index++;
            });

            setIngredientNames(ingredients);
            setIngredientExpirations(expirations);

            //setError(ingredients.to);

            // db.collection("Users").doc("I003q2hhTK4RT80uW5AA").collection("Pantry").get().then((result) => {
            //     setError("hello")
            // })
        } catch (err) {
            setError(err.message);
            console.log(err.message);
        }

    }

    function setIngredientTable() {
        const index = 0;
        setIngredientNames(products => ([...products, { id: index, name: "Chicken", expiration: "eternal", delete: <BsFillTrashFill onClick={(event) => deleteIngredient(event, index)}/>}]))
    }

    function deleteIngredient(e, index) {
        e.preventDefault();

        let copy = ingredientNames.filter(item => item.id !== index)
        for (let i = 0; i < copy.length; i++) {
            if (copy[i].id > index) {
                copy[i].id--;
            }
        }
        setIngredientTable(copy);
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
                    <button>+</button>
                </div>
                <div style={{color: 'red', paddingTop: '1rem', fontSize: 17}}>{error}</div>
                <div>
                    <BootstrapTable
                        bootstrap4
                        keyField="id"
                        data={ingredientNames}
                        columns={columns}
                    />
                </div>
                {/*<button onClick={setIngredientNames}>Remove this button after add ingredient is implemented</button>*/}
                {/*Note: deleting one ingredient will delete them all since they are all currently created with the same ID*/}
            </div>
        </div>
    );
}

