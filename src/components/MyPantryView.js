import React from "react";
import GenerateTableView from "./GenerateTableView";
import App from "./App";

class MyPantryView extends React.Component {

    test() {
        return App()
    }

    render() {
        return (
            <div>
                <div className='contentInsets'>
                    <div className='pageTitle'>
                        My Pantry
                        <span style={{padding: 10}} /* This is blocking the Nav Bar Buttons */ />
                        <button>+</button>
                    </div>
                    <div>
                        <GenerateTableView/>
                    </div>
                </div>
            </div>
        );
    }
}

export default MyPantryView;
