import React from "react";
import NavigationBar from "./NavigationBar";

class ProfileView extends React.Component {
    render() {
        return (
            <div>
                <NavigationBar />
                <div className='contentInsets'>
                    HelloWorld!
                    <div className='card'>
                         <label>
                         Name
                        </label>
                    </div>
                    <div>
                        <label>
                        Your Name
                        </label>
                    </div>
                    <div>
                        <label>
                            Email
                        </label>
                    </div>
                    <div>
                        <label>
                            Your Email
                        </label>
                    </div>
                </div>
            </div>
        );
    }
}


export default ProfileView;
