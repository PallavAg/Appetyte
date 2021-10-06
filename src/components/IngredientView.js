import React, {useEffect, useState} from "react";
import {doc, getDoc} from "firebase/firestore";
import firebase, {db} from "../firebase";
import Collapsible from "react-collapsible";
import {useAuth} from "../contexts/AuthContext";


export default function IngredientView() {

    const {uid} = useAuth();

    const [error, setError] = useState("");

    const [coreIngredients, setCoreIngredients] = useState([]);
    const [sideIngredients, setSideIngredients] = useState([]);

    async function getIngredients() {
        // TODO: Will need to modify slightly based on if viewing your created, saved, or just public recipe
        const recipeCollection = "CreatedRecipes";
        const recipeId = "test_recipe";
        const recipeSnapshot = await getDoc(doc(db, "Users", uid, recipeCollection, recipeId));
        if (recipeSnapshot.exists) {
            const core = recipeSnapshot.data()["coreIngredients"];
            const side = recipeSnapshot.data()["sideIngredients"];
            setCoreIngredients(core);
            setSideIngredients(side);
        } else {
            // doc.data() will be undefined in this case
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
            <span style={{color: 'red', paddingTop: '1rem', fontSize: 17}}>{error}</span>
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
