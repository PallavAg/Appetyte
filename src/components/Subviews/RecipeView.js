import React, {useEffect, useState} from "react";
import {doc, getDoc} from "firebase/firestore";
import firebase, {db} from "../../firebase";
import Collapsible from "react-collapsible";
import {useAuth} from "../../contexts/AuthContext";


export default function RecipeView() {

    const {uid} = useAuth();

    const [error, setError] = useState("");

    const [coreIngredients, setCoreIngredients] = useState([]);
    const [sideIngredients, setSideIngredients] = useState([]);
    const [instructions, setInstructions] = useState([]);
    const[tags, setTags] = useState([]);
    const[notes, setNotes] = useState([]);

    async function getIngredients() {
        // TODO: Will need to modify slightly based on if viewing your created, saved, or just public recipe
        const recipeCollection = "CreatedRecipes";
        //const recipeCollection = collection;
        const recipeId = "5U32XhjmF8TiHwQyVoNT";
        //const recipeId = recId;
        let recipeSnapshot;
        //if (recipeCollection == "CreatedRecipes") {
          //  recipeSnapshot = await getDoc(doc(db, "Users", "8O4wmwxgsbXcr112yd48xe2OHVb2", recipeCollection, recipeId));
        //} else {
            recipeSnapshot = await getDoc(doc(db, "Recipes", recipeId));
        //}
        if (recipeSnapshot.exists) {
            const core = recipeSnapshot.data()["coreIngredients"];
            const side = recipeSnapshot.data()["sideIngredients"];
            const steps = recipeSnapshot.data()[""];
            const tag = recipeSnapshot.data()["tags"];
            const blurb = recipeSnapshot.data()["blurb"];
            setCoreIngredients(core);
            setSideIngredients(side);
            // setInstructions(steps);
            setTags(tag);
            setNotes(blurb);
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

    function generateTagsList() {
        const tagItems = tags.map((tag) =>
            <li>{tag}</li>
        );
        return tagItems;
    }

    return (
        <div className='card'>
            <div className='pageTitle'>Recipe Name</div>
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
            <div className='pageSubtitle'>Instructions</div>
            <span><Collapsible trigger="More">
                <div>
                    <ul>{generateSideIngredientsList()}</ul>
                </div>
            </Collapsible></span>
            <div className='pageSubtitle'>Tags</div>
            <span><Collapsible trigger="More">
                <div>
                    <ul>{generateTagsList()}</ul>
                </div>
            </Collapsible></span>
            <div className='pageSubtitle'>Notes</div>
            <span><Collapsible trigger="More">
                <div>
                    <ul>{notes}</ul>
                </div>
            </Collapsible></span>
        </div>
    );
}
