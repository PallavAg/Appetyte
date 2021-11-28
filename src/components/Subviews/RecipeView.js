import React, {useEffect, useRef, useState} from "react";
import {arrayRemove, doc, getDoc, updateDoc, collection, query, where, getDocs, arrayUnion} from "firebase/firestore";
import Popup from 'reactjs-popup';
import firebase, {db} from "../../firebase";
import Collapsible from "react-collapsible";
import {useAuth} from "../../contexts/AuthContext";
import {Link, useHistory, useLocation} from "react-router-dom";
import {Button, Form} from "react-bootstrap";
import {toast} from "react-hot-toast";
import RecipePreviewCard from "./RecipePreviewCard";
import CommentView from "./CommentView";


export default function RecipeView(props) {

    const {uid} = useAuth();
    const { state } = useLocation(); // Use props.id instead
    const history = useHistory();

    let sharedUsername = useRef(""); // username of user you sharing the recipe with
    let [shareSuccessLabelText, setShareSuccessLabelText] = useState("");
    let [showPopup, setShowPopup] = useState(false);
    let [allSharedNames, setAllSharedNames] = useState([]);

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
    const [comments, setComments] = useState([]);

    async function getIngredients() {
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
            const sharedUsers = recipeSnapshot.data()["shared"];
            const comment = recipeSnapshot.data()["comments"];
            setRecipeName(name);
            setCoreIngredients(core);
            setSideIngredients(side);
            setInstructions(steps);
            setTags(tag);
            setNotes(blurb);
            setImage(imageLink);
            setAuthor(author);
            setName((await getDoc(doc(db, "Users", author))).data().username);
            if (sharedUsers) {
                setAllSharedNames(sharedUsers);
            }
            if (comment) {
                setComments(comment)
            }
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

    function generateSharedNamesList() {
        const usernames = allSharedNames.map((user) =>
            <li>{user.username}</li>
        );
        return [<div style={{paddingTop: "1rem"}}>Shared With:</div>, ...usernames];
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

    async function shareRecipe(e) {
        e.preventDefault();
        setShowPopup(true);

        let sharedUN = sharedUsername.current.value;

        // Make sure they can't share with themselves or the creator
        if (sharedUN === username.toLowerCase()) {
            setShareSuccessLabelText("You cannot share a recipe with the recipe's author.");
            return;
        }
        else if (sharedUN === (await getDoc(doc(db, "Users", uid))).data().username.toLowerCase()) {
            setShareSuccessLabelText("You cannot share a recipe with yourself.");
            return;
        }

        // No error
        setShareSuccessLabelText("");

        // Perform username to uid lookup
        let docSnapshot = await getDocs(query(collection(db, "Users"), where("username", "==", sharedUN)));
        if (docSnapshot.size !== 0) {
            // Share with username
            // Store shared user info under recipe
            await updateDoc(doc(db, "Recipes", props.id), {shared: arrayUnion({"id":props.id, "username":sharedUN})})
            // Store recipe under user to share with
            await updateDoc(doc(db, "Users", docSnapshot.docs[0].id), {shared: arrayUnion(props.id)});

            // Display success or failure
            setShowPopup(false);

            getIngredients();
        } else {
            setShareSuccessLabelText("Username not found.");
        }

    }

    async function unshareRecipe(e) {
        e.preventDefault();

        setShowPopup(true);

        let sharedUN = sharedUsername.current.value;

        // No error
        setShareSuccessLabelText("");

        // Perform username to uid lookup
        let docSnapshot = await getDocs(query(collection(db, "Users"), where("username", "==", sharedUN)));
        if (docSnapshot.size !== 0) {
            // Share with username
            // Remove shared user info under recipe
            await updateDoc(doc(db, "Recipes", props.id), {shared: arrayRemove({"id":props.id, "username":sharedUN})})
            // Remove recipe under user to share with
            await updateDoc(doc(db, "Users", docSnapshot.docs[0].id), {shared: arrayRemove(props.id)});

            // Display success or failure
            setShowPopup(false);

            getIngredients();
        } else {
            setShareSuccessLabelText("Username not found.");
        }
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
                    {author === uid ? <div style={{align: "right", float: "right", display: "inline"}}>
                        <Popup trigger={<Button>Share</Button>} position=" center" open={showPopup} arrow={false}>
                        <div style={{backgroundColor: "white", padding: "2rem", borderRadius: "12px",
                            boxShadow: "0px 0px 13px #aaaaaa", align: "left", float: "left", display: "block",
                            transform: "translate(-104px, 75px)", width: "300px"}}>
                            <Form>
                                <Form.Group className="mb-3" controlId="search" >
                                    <Form.Control
                                        type="name"
                                        placeholder={"Share with Username"}
                                        ref={sharedUsername}
                                    />
                                </Form.Group>
                                <div style={{color: "red"}}>{shareSuccessLabelText}</div>
                                <Button style={{borderRadius: 5, align: 'center', color: 'black', backgroundColor: 'lightgray', borderColor: 'lightgray'}}
                                        onClick={e => shareRecipe(e)}
                                        type="submit"
                                >Share</Button>
                                <Button style={{borderRadius: 5, align: 'center', color: 'black', backgroundColor: 'lightgray', borderColor: 'lightgray', marginLeft: "0.5rem"}}
                                        onClick={e => unshareRecipe(e)}
                                >Unshare</Button>
                            </Form>
                            <div>{generateSharedNamesList()}</div>

                        </div>
                    </Popup></div> : <div/>}
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
            {author === uid ? <Button variant="outline-danger" onClick={deleteRecipe}>{dltText}</Button> : <></>}

            <div className='card' style={{backgroundColor: '#ebebeb', borderRadius: '15px', marginTop: "1rem"}}>
                <div style={{paddingLeft: '1rem', paddingRight: '1rem', paddingBottom: '1rem', }} onClick={() => {}}>
                    {React.createElement(CommentView, {comments: comments})}
                </div>
            </div>

        </div>
    );
}
