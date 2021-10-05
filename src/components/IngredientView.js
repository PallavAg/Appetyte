import React, {useState} from "react";
import firebase from "../firebase";
import Collapsible from "react-collapsible";


export default function IngredientView() {

    const [coreIngredients, setCoreIngredients] = useState([
        { name: "Chicken", quantity: "1 cup"},
        { name: "White Rice", quantity: "2 cups"}
    ]);
    const [sideIngredients, setSideIngredients] = useState([
        { name: "Salt", quantity: "1 teaspoon"},
        { name: "Pepper", quantity: "1 tablespoon"}
    ]);

    async function getIngredients() {
        // TODO: Will need to modify slightly based on if viewing your created, saved, or just public recipe
        let recipeCollection = "CreatedRecipes"
        let userId = "userId"
        let recipeId = "recipeID"
        firebase.firestore().collection("Users")
            .doc(userId)
            .collection(recipeCollection)
            .doc(recipeId)
            .get().then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());

                this.state.coreIngredients = doc.data()["coreIngredients"];
                this.state.sideIngredients = doc.data()["sideIngredients"];

            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });



    }

    function generateCoreIngredientsList() {
        const coreItems = coreIngredients.map((ingredient) =>
            <li>{ingredient.quantity} {ingredient.name}</li>
        );
        return coreItems;
    }

    function generateSideIngredientsList() {
        const sideItems = sideIngredients.map((ingredient) =>
            <li>{ingredient.quantity} {ingredient.name}</li>
        );
        return sideItems;
    }

    return (
        <div className='card'>
            <span className='pageSubtitle'>Core Ingredients</span>
            <span><Collapsible trigger="More">
                <div>
                    <ul>{generateCoreIngredientsList()}</ul>
                </div>
            </Collapsible></span>

            <div className='pageSubtitle'>Side Ingredients</div>
            <span><Collapsible trigger="More">
                <div>
                    <ul>{generateSideIngredientsList()}</ul>
                </div>
            </Collapsible></span>

        </div>
    );
}
