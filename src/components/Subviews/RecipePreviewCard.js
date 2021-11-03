import React, {useEffect, useState} from "react";
import {db} from "../../firebase";
import {Button} from "react-bootstrap";
import {useAuth} from "../../contexts/AuthContext";
import {doc, updateDoc, arrayUnion, arrayRemove} from "firebase/firestore";

export default function RecipePreviewCard(props) {

    const {uid} = useAuth();

    const [recipeID] = useState(props.recipe.id)
    const [recipeName] = useState(props.recipe.name)
    const [coreIngredients] = useState(props.recipe.coreIngredients)

    const [upvoted, setUpvoted] = useState(false)
    const [downvoted, setDownvoted] = useState(false)
    const [voteCount, setVoteCount] = useState(0)

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
    });

    async function performUpvote() {
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

        <div className='smallCard'>
            <div className='leftContentInsets'>
                <div className='pageSubtitle'>{recipeName}</div>
                <div>
                    <ul>{generateCoreIngredientsList()}</ul>
                </div>

                {/*Begin Voting UI*/}
                <hr/>

                <div style={{paddingBottom: '1rem', display: 'flex'}}>
                    <Button style={{boxShadow: 'none'}} variant={upvoted ? "primary btn-sm" : "outline-primary btn-sm"} onClick={performUpvote}>↑</Button>
                    <b style={{padding: '0.5rem'}}>{`${voteCount}`}</b>
                    <Button style={{boxShadow: 'none'}} variant={downvoted ? "danger btn-sm" : "outline-danger btn-sm"} onClick={performDownvote}>↓</Button>
                </div>
            </div>
        </div>

    );
}