import React, {useEffect, useState} from "react";
import {doc, getDoc} from "firebase/firestore";
import firebase, {db} from "../../firebase";
import Collapsible from "react-collapsible";
import {useAuth} from "../../contexts/AuthContext";
import {useLocation} from "react-router-dom";


export default function RecipeView(props) {

    const {uid} = useAuth();
    const { state } = useLocation(); // Use props.id instead

    const [error, setError] = useState("");

    const [recipeName, setRecipeName] = useState([]);
    const [coreIngredients, setCoreIngredients] = useState([]);
    const [sideIngredients, setSideIngredients] = useState([]);
    const [instructions, setInstructions] = useState({});
    const[tags, setTags] = useState([]);
    const[notes, setNotes] = useState([]);
    const[author, setAuthor] = useState("");

    async function getIngredients() {
        // TODO: Will need to modify slightly based on if viewing your created, saved, or just public recipe
        //const recipeCollection = "CreatedRecipes";
        const recipeId = props.id;
        console.log(recipeId);
        //const recipeCollection = collection;
        //const recipeId = "5U32XhjmF8TiHwQyVoNT";
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
            const steps = recipeSnapshot.data()["instructions"];
            const tag = recipeSnapshot.data()["tags"];
            const blurb = recipeSnapshot.data()["blurb"];
            const name = recipeSnapshot.data()["name"];
            const author = recipeSnapshot.data()["author"];
            setRecipeName(name);
            setCoreIngredients(core);
            setSideIngredients(side);
            setInstructions(steps);
            setTags(tag);
            setNotes(blurb);
            if (author === uid) {
                setAuthor("This recipe was created by you");
            }


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

    function generateInstructions() {
        console.log(instructions);
        if (!instructions) return (<></>)
        let insts = [];
        for (const [key, value] of Object.entries(instructions)) {
            insts.push(<li>{value}</li>);
        }
        return insts;
    }

    function generateTagsList() {
        const tagItems = tags.map((tag) =>
            <li>{tag}</li>
        );
        return tagItems;
    }

    return (
        <div className='card' style={{backgroundColor: '#ebebeb', borderRadius: '15px'}}>
            <div className='pageTitle'>
                {recipeName}
            </div>
            <div>
                {author}
            </div>
            <span style={{color: 'red', paddingTop: '1rem', fontSize: 17}}>{error}</span>

            <span className='pageSubtitle'>Core Ingredients</span>
                <div>
                    <ul>{generateCoreIngredientsList()}</ul>
                </div>

            <div className='pageSubtitle'>Side Ingredients</div>
                <div>
                    <ul>{generateSideIngredientsList()}</ul>
                </div>
            <div className='pageSubtitle'>Instructions</div>
                <div>
                    <ul>{generateInstructions()}</ul>
                </div>
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
