import React, {useState} from "react"
import RecipePreviewCard from "./Subviews/RecipePreviewCard";

export default function SearchPage() {

    return (
        <div className='contentInsets'>
            <div className='pageTitle'>Search</div>

            <div>{RecipePreviewCard("Turduckens", [{name: "Turkey"}, {name: "Duck"}, {name: "Chicken"}, {name: "Chicken2"}, {name: "Chicken3"}, {name: "Chicken4"}])}</div>
        </div>
    );

}
