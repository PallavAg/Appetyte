import React, {useEffect, useState} from "react";
import {db} from "../../firebase";
import {Button} from "react-bootstrap";
import {useAuth} from "../../contexts/AuthContext";
import {doc, updateDoc, arrayUnion, arrayRemove} from "firebase/firestore";
import {toast} from "react-hot-toast";
import {Link} from "react-router-dom";

export default function RecipePreviewCard(props) {


    const {uid} = useAuth();

    const [recipeID] = useState(props.id)
    const [recipeName] = useState(props.recipe.name)
    const [coreIngredients] = useState(props.recipe.coreIngredients)

    const [saved, setSaved] = useState(false)
    const [upvoted, setUpvoted] = useState(false)
    const [downvoted, setDownvoted] = useState(false)
    const [voteCount, setVoteCount] = useState(0)

    const [hideElementsOnCookbook, setHideElementsOnCookbook] = useState(props.interactiveElement)
    const viewingSavedView = (props.savedView === 1)

    const recipeRef = doc(db, "Recipes", recipeID);

    function generateCoreIngredientsList() {
        const coreItems = coreIngredients.map((ingredient) =>
            <li>{ingredient.quantity} {ingredient.name}</li>
        );
        if (coreItems.length > 5) {
            // Only show first 5 ingredients
            coreItems.length = 5;
        }
        return coreItems;
    }

    useEffect(()=> {
        getVotes()
        getSavedState()
    });

    async function performSave() {
        if (!uid) {
            toast.error("You must be logged in to save a post")
            return
        }

        const userRef = doc(db, "Users", uid);

        setSaved(!saved)
        if (saved) await updateDoc(userRef, {saved: arrayRemove(recipeID)}); // Save recipe
        else await updateDoc(userRef, { saved: arrayUnion(recipeID) }); // Un-save recipe

        getSavedState()
        if (viewingSavedView && saved) {document.getElementById(props.id).remove()}

    }

    function getSavedState() {
        if (!uid) return

        db.collection("Users").doc(uid).get().then((doc) => {
            if (doc.exists && doc.data().saved?.includes(recipeID)) setSaved(true)
            else setSaved(false)
        })
    }

    async function performUpvote() {
        if (!uid) {
            toast.error("You must be logged in to vote on posts")
            return
        }

        setUpvoted(!upvoted)
        if (upvoted) {
            await updateDoc(recipeRef, { upvotedList: arrayRemove(uid) }); // Remove upvote
        } else {
            await updateDoc(recipeRef, { downvotedList: arrayRemove(uid) }); // Remove downvote
            await updateDoc(recipeRef, { upvotedList: arrayUnion(uid) }); // Add Upvote
        }
        getVotes()
    }

    async function performDownvote() {
        if (!uid) {
            toast.error("You must be logged in to vote on posts")
            return
        }
        
        setDownvoted(!downvoted)
        if (downvoted) {
            await updateDoc(recipeRef, { downvotedList: arrayRemove(uid) }); // Remove downvote
        } else {
            await updateDoc(recipeRef, { upvotedList: arrayRemove(uid) }); // Remove upvote
            await updateDoc(recipeRef, { downvotedList: arrayUnion(uid) }); // Add downvote
        }
        getVotes()
    }

    // Update the card to reflect the votes
    function getVotes() {
        db.collection("Recipes").doc(recipeID).get().then((doc) => {
            if (doc.exists) {
                const votes = doc.data().upvotedList?.length - doc.data().downvotedList?.length
                if (!isNaN(votes)) setVoteCount(votes)
                if (doc.data().upvotedList?.includes(uid)) setUpvoted(true)
                else setUpvoted(false)
                if (doc.data().downvotedList?.includes(uid)) setDownvoted(true)
                else setDownvoted(false)
            }
        })
    }

    return (

        <div id={props.id} className='smallCard'>
            <div className='leftContentInsets'>
                <div style={{display: 'flex'}}>
                    <div className='pageSubtitle' onClick={() => {props.viewingState(true)}}><u style={{ textDecorationColor: 'blue'}}>{recipeName}</u></div>
                    <Button style={{boxShadow: 'none', margin: '0.5rem', display: viewingSavedView ? 'block' : hideElementsOnCookbook}} variant={saved ? "warning" : "outline-warning"} onClick={performSave}><b>{saved ? "Saved" : "Save"}</b></Button>
                </div>
                <div>
                    <ul>{generateCoreIngredientsList()}</ul>
                </div>

                {/*Begin Voting UI*/}
                <hr style={{display: hideElementsOnCookbook}}/>

                <div style={{paddingBottom: '1rem', display: hideElementsOnCookbook}}>
                    <Button style={{boxShadow: 'none'}} variant={upvoted ? "primary btn-sm" : "outline-primary btn-sm"} onClick={performUpvote}><b>↑</b></Button>
                    <b style={{padding: '0.5rem'}}>{`${voteCount}`}</b>
                    <Button style={{boxShadow: 'none'}} variant={downvoted ? "danger btn-sm" : "outline-danger btn-sm"} onClick={performDownvote}><b>↓</b></Button>
                </div>
            </div>
        </div>

    );
}