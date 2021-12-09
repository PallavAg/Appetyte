import React, {useState, useRef, useEffect} from "react";
import RecipePreviewCard from "./RecipePreviewCard";
import {Button, Form} from "react-bootstrap";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {db} from "../../firebase";
import {useAuth} from "../../contexts/AuthContext";


export default function CommentView(props) {

    const {uid} = useAuth();

    const [error, setError] = useState("");
    const [comments, setComments] = useState([]);
    let addCommentText = useRef("");

    // Generate a view containing all the comments
    function displayComments() {
        if (comments === null || comments.length === 0) {
            return <div className='leftContentInsets'>No Comments</div>
        }

        return comments.map((comment) =>
            <div style={{paddingLeft: '1rem', paddingRight: '1rem', paddingBottom: '1rem', marginTop: "0.5rem", backgroundColor: "white", borderRadius: '7px',}} onClick={() => {}}>
                <div style={{paddingTop: "0.5rem", color: "gray", fontWeight: "bold"}}>{comment.username}</div>
                <div style={{paddingLeft: "1rem"}}>{comment.comment}</div>
            </div>
        );

    };


    // Add a comment to a recipe
    async function addComment(e) {
        e.preventDefault();

        if (uid === null) {
            setError("You must be logged in to comment.")
            return;
        }

        if (addCommentText.current.value === "") {
            // Don't allow to add empty comment
            return;
        }

        setError("");

        let commentUsername = (await getDoc(doc(db, "Users", uid))).data().username.toLowerCase()

        const newComments = [...comments, {comment: addCommentText.current.value, username: commentUsername}];
        await updateDoc(doc(db, "Recipes", props.recipeId), {comments: newComments});

        setComments(newComments);
        addCommentText.current.value = "";
    }


    useEffect( ()=> {
        setComments([...props.comments]);
    }, [props.comments]);

    return (
       <div>
           <div className="pageSubtitle" style={{paddingTop: "0rem"}} >Comments</div>
           <Button style={{float: "right",  maxWidth: "25%"}} onClick={e => addComment(e)}>Add Comment</Button>
           <Form style={{maxWidth: "75%"}}>
               <Form.Group className="mb-3" controlId="addComment" >
                   <Form.Control
                       type="name"
                       placeholder={"Add a comment"}
                       ref={addCommentText}
                   />
               </Form.Group>
           </Form>
           <div style={{marginTop: "2rem"}}>
               <div style={{color: "red"}}>{error}</div>
               {displayComments()}
           </div>

       </div>
    );

}
