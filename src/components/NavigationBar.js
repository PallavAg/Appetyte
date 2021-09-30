import React from "react";

class NavigationBar extends React.Component {
    render() {
        return (
            <div className='navigationBar'>
                <div className='navigationBarContent'>
                    <label className='homeButton'>Appetyte</label>
                    <span className='rightJustified'>
                        <label className='navigationBarText'>Cookbook</label>
                        <label className='navigationBarText'>My Pantry</label>
                    </span>
                </div>
            </div>
        );
    }
}

export default NavigationBar;
