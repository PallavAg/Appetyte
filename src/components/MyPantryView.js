import React from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import { Button } from 'react-bootstrap'
import firebase, {auth} from "../firebase";



export default function MyPantryView() {

    async function getIngredients() {

        try {
            let userId = auth.tenantId;
            console.log(userId);
            firebase.firestore().collection("Users")
        } catch (err) {
            console.log(err.message)
        }

    }

    const products = [
        { id: "Chicken", name: "1 week", delete: <Button>Trash Icon {getIngredients}</Button> },

    ];

    const columns = [
        {
            dataField: "id",
            text: "Ingredient",
            sort: true
        },
        {
            dataField: "name",
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
                <div>
                    <BootstrapTable
                        bootstrap4
                        keyField="id"
                        data={products}
                        columns={columns}
                    />
                </div>
            </div>
        </div>
    );
}

