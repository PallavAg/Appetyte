import React from "react";


class IngredientView extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            coreIngredients: ["Chicken", "White Rice"],
            sideIngredients: ["Salt", "Pepper"],
        };
    }

    generateCoreIngredientsList() {
        const coreItems = this.state.coreIngredients.map((ingredient) =>
            <li>{ingredient}</li>
        );
        return coreItems;
    }

    generateSideIngredientsList() {
        const sideItems = this.state.sideIngredients.map((ingredient) =>
            <li>{ingredient}</li>
        );
        return sideItems;
    }

    render() {
        return (
            <div className='card'>
                <div className='pageSubtitle'>Core Ingredients</div>
                <div>
                    <ul>{this.generateCoreIngredientsList()}</ul>
                </div>
                <div className='pageSubtitle'>Side Ingredients</div>
                <div>
                    <ul>{this.generateSideIngredientsList()}</ul>
                </div>
            </div>
        );
    }
}

export default IngredientView;
