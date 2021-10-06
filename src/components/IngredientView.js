import React, {useEffect, useState} from "react";
import {getDoc} from "firebase/firestore";
import firebase, {db} from "../firebase";
import Collapsible from "react-collapsible";
import {useAuth} from "../contexts/AuthContext";


export default function IngredientView() {

    const {uid, getUnverifiedUID} = useAuth();

    const [error, setError] = useState("");

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
        const recipeCollection = "CreatedRecipes";
        const recipeId = "test_recipe";
        const recipeSnapshot = "";// = await getDoc(db, "Users", uid, recipeCollection, recipeId);
        if (recipeSnapshot.exists) {
            const name = recipeSnapshot.data()["name"];
            //setCoreIngredients([{name: name, quantity: name}]);
        } else {
            // doc.data() will be undefined in this case
            setError(uid);
            console.log("No such document!");
        }

    }

    useEffect(()=>{
        getIngredients().then((r) =>
            console.log(r)
        );
    }, []);

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
            <div style={{color: 'red', paddingTop: '1rem', fontSize: 17}}>{error}</div>
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
