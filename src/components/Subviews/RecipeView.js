import React, {useEffect, useState} from "react";
import {arrayRemove, doc, getDoc, updateDoc, collection, query, where, getDocs} from "firebase/firestore";
import firebase, {db} from "../../firebase";
import Collapsible from "react-collapsible";
import {useAuth} from "../../contexts/AuthContext";
import {Link, useHistory, useLocation} from "react-router-dom";
import {Button} from "react-bootstrap";
import {toast} from "react-hot-toast";


export default function RecipeView(props) {

    const {uid} = useAuth();
    const { state } = useLocation(); // Use props.id instead
    const history = useHistory()

    const [error, setError] = useState("");

    const [recipeName, setRecipeName] = useState([]);
    const [coreIngredients, setCoreIngredients] = useState([]);
    const [sideIngredients, setSideIngredients] = useState([]);
    const [instructions, setInstructions] = useState({});
    const[tags, setTags] = useState([]);
    const[notes, setNotes] = useState([]);
    const[author, setAuthor] = useState("");
    const[username, setName] = useState("");
    const[image, setImage] = useState("");
    const[dltText, setDltText] = useState("Delete Recipe");

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
            const imageLink = recipeSnapshot.data()["image"];
            setRecipeName(name);
            setCoreIngredients(core);
            setSideIngredients(side);
            setInstructions(steps);
            setTags(tag);
            setNotes(blurb);
            setImage(imageLink);
            setAuthor(author)
            setName((await getDoc(doc(db, "Users", author))).data().username)

        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }

    }

    useEffect(()=>{
        getIngredients().then(r => {});
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
        if (tags.length === 0 || tags[0].length === 0) return (<p>No Tags</p>)
        return tagItems;
    }

    async function deleteRecipe() {
        if (dltText === "Delete Recipe") {
            setDltText("Are you sure? Click again to delete.")
            return
        }

        setDltText("Deleting...")
        const id = props.id

        // Delete recipe object
        await db.collection("Recipes").doc(id).delete()

        // Delete from 'createdRecipes' array
        const user = doc(db, 'Users', uid);
        await updateDoc(user, { createdRecipes: arrayRemove(id) }); // Remove as a created recipe

        // Delete from saved arrays
        const q = query(collection(db, "Users"), where('saved', 'array-contains-any', [id]));
        const docs = await getDocs(q)
        docs.forEach((userDoc) => updateDoc(doc(db, 'Users', userDoc.id), { saved: arrayRemove(id) }))

        if (window.location.pathname.includes("cookbook")) window.location.reload(false)
        else history.push("/cookbook")

        toast.success("Recipe Deleted")
    }

    return (
        <div>
            <div className='card' style={{backgroundColor: '#ebebeb', borderRadius: '15px'}}>

                {author !== uid ?
                    <h4>
                        {"Chef: "}
                        <Link onClick={() => {if (props.viewingState) props.viewingState(false)}} to={{pathname: `/cookbook`, profileID: author}}>
                            <b>{username}</b>
                        </Link>
                    </h4>
                    : <></>}

                <div className='pageTitle'>
                    {recipeName}
                </div>
                {author === uid ? <div>This recipe was created by you</div> : <div style={{marginBottom: '-30px'}}/>}
                <span style={{color: 'red', paddingTop: '1rem', fontSize: 17}}>{error}</span>

                <span className='pageSubtitle'>Core Ingredients</span>
                <div>
                    <ul>{generateCoreIngredientsList()}</ul>
                </div>

                <div className='pageSubtitle'>Side Ingredients</div>
                <div>
                    {sideIngredients.length !== 0 ? <ul>{generateSideIngredientsList()}</ul> : <p>No Side Ingredients Required</p>}
                </div>
                <div className='pageSubtitle'>Instructions</div>
                <div>
                    <ul>{generateInstructions()}</ul>
                </div>
                <img style={{maxWidth: '30%'}} src={image}/>
                <div className='pageSubtitle'>Tags</div>
                <div>
                    {generateTagsList()}
                </div>
                <div className='pageSubtitle'>Notes</div>
                <p>{notes.length === 0 ? "No Notes" : notes}</p>
            </div>
            <br/>
            {author === uid ? <Button variant="outline-danger" onClick={deleteRecipe}>{dltText}</Button> : <></>}

        </div>
    );
}
