import React, {useState} from "react";
import RecipePreviewCard from "./RecipePreviewCard";
import {Button} from "react-bootstrap";


export default function CommentView(props) {

    function displayComments() {
        if (props.comments == null || props.comments.length == 0) {
            return <div className='leftContentInsets'>No Comments</div>
        }

        return props.comments.map((comment) =>
            <div style={{paddingLeft: '1rem', paddingRight: '1rem', paddingBottom: '1rem', backgroundColor: "white", borderRadius: '7px',}} onClick={() => {}}>
                {comment}
            </div>
        );

    };

    async function addComment() {};

    return (
       <div>
           <Button style={{float: "right"}}>Add Comment</Button>
           <div className="pageSubtitle" style={{paddingTop: "0rem"}} onClick={addComment()}>Comments</div>
           <div>{displayComments()}</div>

       </div>
    );

}
