import React, {useState} from "react";

export default function RecipePreviewCard(recipeName, coreIngredients) {

    function generateCoreIngredientsList() {
        const coreItems = coreIngredients.map((ingredient) =>
            <li>{ingredient.name}</li>
        );
        if (coreItems.length > 5) {
            // Only show first 5 ingredients
            coreItems.length = 5;
        }
        return coreItems;
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