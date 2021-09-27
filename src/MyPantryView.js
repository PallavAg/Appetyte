import React from "react";
import NavigationBar from "./NavigationBar";
import GenerateTableView from "./GenerateTableView";
import App from "./App";


class MyPantryView extends React.Component {

    test() {
        return App()
    }

    render() {
        return (
            <div>
                <NavigationBar />
                <div className='contentInsets'>
                    <div className='pageTitle'>
                        My Pantry
                        <span style={{padding: 255}} />
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
