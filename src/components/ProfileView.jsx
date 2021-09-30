import React from "react";
import NavigationBar from "./NavigationBar";

class ProfileView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "Jane Doe",
            userName: "janedoe",
            email: "janedoe@example.com"
        }
    }

    render() {
        return (
            <div>
                <NavigationBar />
                <div className='contentInsets'>
                    <div className='pageTitle'>Your Profile</div>
                        <div className='contentInsets'>
                        <div className='pageSubtitle'>NAME</div>
                        <div className='pageSubSubtitle'>{this.state.name}</div>
                        <div className='pageSubtitle'>USERNAME</div>
                        <div className='pageSubSubtitle'>{this.state.userName}</div>
                        <div className='pageSubtitle'>EMAIL</div>
                        <div className='pageSubSubtitle'>{this.state.email}</div>
                        <div>
                            <button className='standardButton'>Log In</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default ProfileView;
