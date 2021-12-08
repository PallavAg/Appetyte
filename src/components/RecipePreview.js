import React, {useEffect, useRef, useState} from "react";
import {arrayRemove, doc, getDoc, updateDoc, collection, query, where, getDocs, arrayUnion} from "firebase/firestore";
import Popup from 'reactjs-popup';
import firebase, {db} from "../firebase";
import Collapsible from "react-collapsible";
import {useAuth} from "../contexts/AuthContext";
import {Link, useHistory, useLocation} from "react-router-dom";
import {Button, Form} from "react-bootstrap";
import {toast} from "react-hot-toast";


export default function RecipePreview(props) {

    const {uid} = useAuth();
    const { state } = useLocation(); // Use props.id instead
    const history = useHistory();

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
    const[servingCount, setServingCount] = useState(1);

    async function getIngredients() {
        //const recipeCollection = "CreatedRecipes";
        //const recipeCollection = collection;
        //const recipeId = "5U32XhjmF8TiHwQyVoNT";
        //const recipeId = recId;
        //if (recipeCollection == "CreatedRecipes") {
        //  recipeSnapshot = await getDoc(doc(db, "Users", "8O4wmwxgsbXcr112yd48xe2OHVb2", recipeCollection, recipeId));
        //} else {
        //}
            const core = props.coreIngredients;
            const side = props.sideIngredients;
            const steps = props.instructions;
            const tag = props.tags;
            const blurb = props.blurb;
            const name = props.name;
            const author = props.author;
            const imageLink = props.image;
            setRecipeName(name);
            setCoreIngredients(core);
            setSideIngredients(side);
            setInstructions(steps);
            setTags(tag);
            setNotes(blurb);
            setImage(imageLink);
            setAuthor(author);
            setName((await getDoc(doc(db, "Users", author))).data().username);
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

    function updateIngredients(arr, diff) {
        for (let i = 0; i < arr.length; i++) {
            arr[i].name = arr[i].quantity + " " + arr[i].name
            arr[i].quantity = ""

            let ingredients = arr[i].name.split(" ").filter(n => n)
            let firstWord = ingredients[0]

            if (!isNaN(firstWord)) {
                ingredients[0] = ((parseInt(firstWord) / servingCount) * (servingCount + diff)) + ""
                arr[i].name = ingredients.join(" ")
            }
        }

        return arr
    }

    function updateServingCount(diff) {
        if (servingCount === 1 && diff === -1) return

        setServingCount(Math.max(servingCount + diff, 1))
        setCoreIngredients(updateIngredients([...coreIngredients], diff))
        setSideIngredients(updateIngredients([...sideIngredients], diff))

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

                <div>
                    <b className='pageSubtitle'>{"Serving Size: "}</b>
                    <b style={{padding: '0.5rem', fontSize: '20px'}}>{`${servingCount}`}</b>
                    <Button style={{boxShadow: 'none'}} variant={"outline-primary btn-sm"} onClick={() => {updateServingCount(1)}}><b>↑</b></Button>
                    <Button style={{boxShadow: 'none', margin: '5px'}} variant={"outline-primary btn-sm"} onClick={() => {updateServingCount(-1)}}><b>↓</b></Button>
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

        </div>
    );
}
