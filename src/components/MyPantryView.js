import React, {useState} from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import { Button } from 'react-bootstrap';
import { BsFillTrashFill } from 'react-icons/bs';
import firebase, {auth} from "../firebase";



export default function MyPantryView() {

    const [error, setError] = useState("");

    async function getIngredients() {

        try {
            let userId = auth.tenantId;
            console.log(userId);
            firebase.firestore().collection("Users").doc(userId).collection("Pantry").get()
        } catch (err) {
            console.log(err.message)
        }

    }

    const [products, setProducts] = useState([]);

    function setIngredients() {
        const index = 0;
        setProducts(products => ([...products, { id: index, name: "Chicken", expiration: "eternal", delete: <BsFillTrashFill onClick={(event) => deleteIngredient(event, index)}/>}]))
    }

    function deleteIngredient(e, index) {
        e.preventDefault();

        let copy = products.filter(item => item.id !== index)

        for (let i = 0; i < copy.length; i++) {
            if (copy[i].id > index) {
                copy[i].id--;
            }
        }
        setProducts(copy);
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

