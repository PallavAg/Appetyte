import React, {useEffect, useState} from "react";
import {db} from "../../firebase";

export default function RecipePreviewCard(props) {

    const [recipeID] = useState(props.recipe.id)
    const [recipeName] = useState(props.recipe.name)
    const [coreIngredients] = useState(props.recipe.coreIngredients)

    const [upvoted, setUpvoted] = useState(false)
    const [downvoted, setDownvoted] = useState(false)
    const [voteCount, setVoteCount] = useState(false)

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

    // Todo: Work in Progress
    useEffect(()=>{
        getVotes()
    }, []);

    function getVotes() {
        db.collection("Recipes").doc(recipeID).get().then((doc) => {
            if (doc.exists) {
                console.log(recipeName + ": " + doc.data().upvoteCount)
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
            </div>
        </div>

    );
}