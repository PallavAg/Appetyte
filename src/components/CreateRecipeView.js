import React, {useEffect, useRef, useState} from "react";
import {Button, Form, Row, Col} from "react-bootstrap";
import Switch from "react-switch";
import BootstrapTable from "react-bootstrap-table-next";
import firebase, {db} from "../firebase";
import {BsFillTrashFill} from "react-icons/bs";
import {doc, collection, addDoc, setDoc, updateDoc, arrayUnion, getDoc, getDocs, query} from "firebase/firestore";
import {useAuth} from "../contexts/AuthContext";
import RecipePreviewCard from "./Subviews/RecipePreviewCard";
import {toast} from "react-hot-toast";
import {jsonToCSV} from "react-papaparse";
import RecipeView from "./Subviews/RecipeView";
import Popup from "reactjs-popup";
import RecipePreview from "./RecipePreview";

export default function CreateRecipeView(props) {

    const {uid} = useAuth();

    const [asdf, setAsdf] = useState("");

    let [showPreviewPopup, setShowPreviewPopup] = useState(false);

    const [coreIngredientNames, setCoreIngredientNames] = useState([]);
    const [coreIngredientQuantities, setCoreIngredientQuantities] = useState([]);
    const [coreIngredients, setCoreIngredients] = useState([]);
    const [sideIngredientNames, setSideIngredientNames] = useState([]);
    const [sideIngredientQuantities, setSideIngredientQuantities] = useState([]);
    const [sideIngredients, setSideIngredients] = useState([]);
    // Todo: change this initial state!!
    const [instructions, setInstructions] = useState([]);
    const [image, setImage] = useState("");
    const [editState, setEditState] = useState("Create");

    // const [instructionForms, setInstructionForms] = useState(
    //     [
    //         { id: "0", name: addInstructionForm("0"), delete: <BsFillTrashFill onClick={(event) => deleteIngredient(event, 0)}/> },
    //         { id: "1", name: addInstructionForm("1"), delete: <BsFillTrashFill onClick={(event) => deleteIngredient(event, 1)}/> },
    //     ]
    // );
    // const [coreIngredientForms, setCoreIngredientForms] = useState(
    //     [
    //         { quantity: addCoreIngredientQuantityForm("0"), name: addCoreIngredientNameForm("0"), delete: <BsFillTrashFill onClick={(event) => deleteIngredient(event, 0)}/> },
    //         { quantity: addCoreIngredientQuantityForm("1"), name: addCoreIngredientNameForm("1"), delete: <BsFillTrashFill onClick={(event) => deleteIngredient(event, 1)}/> },
    //     ]
    // )
    // const [sideIngredientForms, setSideIngredientForms] = useState(
    //     [
    //         { quantity: addSideIngredientQuantityForm("0"), name: addSideIngredientNameForm("0"), delete: <BsFillTrashFill onClick={(event) => deleteIngredient(event, 0)}/> },
    //         { quantity: addSideIngredientQuantityForm("1"), name: addSideIngredientNameForm("1"), delete: <BsFillTrashFill onClick={(event) => deleteIngredient(event, 1)}/> },
    //     ]
    // )

    const ingredientColumns = [
        {
            dataField: "quantity",
            text: "",
            sort: true
        },
        {
            dataField: "name",
            text: "",
            sort: true
        },
        // {
        //     dataField: "delete",
        //     text: ""
        // }
    ];

    const columns = [
        {
            dataField: "id",
            text: "",
            sort: true
        },
        {
            dataField: "name",
            text: "",
            sort: true
        },
        // {
        //     dataField: "delete",
        //     text: ""
        // }
    ];

    // Yeah this function is kinda wack....
    // whichList: 0 -> coreIngredientNames
    //            1 -> coreIngredientQuantities
    //            2 -> sideIngredientNames
    //            3 -> sideIngredientQuantities
    //            4 -> instructions
    const setField = (field, value, id, whichList) => {
        //setError(value.toString() + id.toString());
        switch (whichList) {
            case 0:
                const copy1 = [...coreIngredientNames];
                copy1[id] = value;
                setCoreIngredientNames(copy1);
                break;
            case 1:
                const copy2 = [...coreIngredientQuantities];
                copy2[id] = value;
                setCoreIngredientQuantities(copy2);
                break;
            case 2:
                const copy3 = [...sideIngredientNames];
                copy3[id] = value;
                setSideIngredientNames(copy3);
                break;
            case 3:
                const copy4 = [...sideIngredientQuantities];
                copy4[id] = value;
                setSideIngredientQuantities(copy4);
                break;
            case 4:
                const copy5 = [...instructions];
                copy5[id] = value;
                setInstructions(copy5);
                break;
            default:
                break;
        }
    }

    function addCoreIngredientNameForm(id) {
        return (<Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Control
                    type="name"
                    placeholder={"Ingredient"}
                    onChange={e => setField('name', e.target.value, id, 0)}
                />
            </Form.Group>
        </Form>)
    }
    function addCoreIngredientQuantityForm(id) {
        return (<Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Control
                    type="name"
                    placeholder={"Quantity"}
                    //id={id}
                    onChange={e => setField('name', e.target.value, id, 1)}
                />
            </Form.Group>
        </Form>)
    }
    function addSideIngredientNameForm(id) {
        return (<Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Control
                    type="name"
                    placeholder={"Ingredient"}
                    //id={id}
                    onChange={e => setField('name', e.target.value, id, 2)}
                />
            </Form.Group>
        </Form>)
    }
    function addSideIngredientQuantityForm(id) {
        return (<Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Control
                    type="name"
                    placeholder={"Quantity"}
                    //id={id}
                    onChange={e => setField('name', e.target.value, id, 3)}
                />
            </Form.Group>
        </Form>)
    }

    function addInstructionForm(id) {

        return (//show => {

            <div><Form>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Control
                        type="name"
                        placeholder={"Instruction"}
                        value={asdf}
                        onChange={e => {setAsdf(e.target.value)}}
                        // value={instructions[id.toString()]}
                        // onChange={e => setField('name', e.target.value, id, 4)}
                    />
                </Form.Group>
            </Form>
            </div>
        )
        //})
    }

    function deleteIngredient(e, index) {
        e.preventDefault();
        // Need to delete from dictionary and shift everything above it down
        // TODO: Pantry page should shift indices down if you don't call delete on the last index
        //setProducts(products => (products.filter(item => item.id !== index)));
    }

    function deleteInstruction(e, index) {
        e.preventDefault();
        let copy = instructions.filter(item => item.id !== index)
        for (let i = 0; i < copy.length; i++) {
            if (copy[i].id > index) {
                copy[i].id--;
            }
        }
        instructions(copy);
    }

    function addInstructionRow() {
        //let index = instructionForms.length
        //setInstructionForms(insts => ([...insts, {id: index, name: addInstructionForm(index), delete: <BsFillTrashFill onClick={(event) => deleteIngredient(event, index)}/> }]));
        const num_instructions = Object.keys(instructions).length;
        if (instructions[(num_instructions - 1).toString()] === "") {
            return;
        }
        const copy = [...instructions];
        copy[num_instructions.toString()] = "";
        setInstructions(copy);
    }

    function addCoreIngredientRow() {
        // let index = coreIngredientForms.length
        // setCoreIngredientForms(coreIngredients => ([...coreIngredients, {quantity: addCoreIngredientQuantityForm(index), name: addCoreIngredientNameForm(index), delete: <BsFillTrashFill onClick={(event) => deleteIngredient(event, index)}/> }]));
        //setError(coreIngredientQuantities.at(-1))
        if (coreIngredientQuantities.size > 0 && coreIngredientQuantities.at(-1) === "") {
            return;
        }

        const copy = [...coreIngredientQuantities];
        copy.push("")
        setCoreIngredientQuantities(copy);
        //setError(JSON.stringify(coreIngredientQuantities))
    }

    function addSideIngredientRow() {
    //     let index = sideIngredientForms.length
    //     setSideIngredientForms(sideIngredients => ([...sideIngredients, {quantity: addCoreIngredientQuantityForm(index), name: addCoreIngredientNameForm(index), delete: <BsFillTrashFill onClick={(event) => deleteIngredient(event, index)}/> }]));
        if (sideIngredientQuantities.size > 0 && sideIngredientQuantities.at(-1) === "") {
            return;
        }
        const copy = [...sideIngredientQuantities];
        copy.push("")
        setSideIngredientQuantities(copy);
    }



    const toggleSwitch = (value) => {
        //To handle switch toggle
        setSwitchValue(value);
        //State changes according to switch
    };

    const [recipeName, setRecipeName] = useState("");
    const [tags, setTags] = useState("");
    const [notes, setNotes] = useState("");

    const [switchValue, setSwitchValue] = useState(true);
    const [error, setError] = useState("");

    async function fillInformation() {
        const recipeId = props.id;
        let recipeSnapshot;
        recipeSnapshot = await getDoc(doc(db, "Recipes", recipeId));
        if (recipeSnapshot.exists) {
            const core = recipeSnapshot.data()["coreIngredients"];
            const side = recipeSnapshot.data()["sideIngredients"];
            const steps = recipeSnapshot.data()["instructions"];
            const tag = recipeSnapshot.data()["tags"];
            const blurb = recipeSnapshot.data()["blurb"];
            const name = recipeSnapshot.data()["name"];
            const imageLink = recipeSnapshot.data()["image"];
            const recipeType = recipeSnapshot.data()["recipeType"];
            setRecipeName(name);
            let coreQuantities = [];
            let coreNames = [];
            let sideQuantities = [];
            let sideNames = [];

            core.forEach(ingredient => {
                coreQuantities.push(ingredient.quantity);
                coreNames.push(ingredient.name);
            })

            side.forEach(ingredient => {
                sideQuantities.push(ingredient.quantity);
                sideNames.push(ingredient.name);
            })

            setCoreIngredientQuantities(coreQuantities);
            setCoreIngredientNames(coreNames);
            setSideIngredientQuantities(sideQuantities);
            setSideIngredientNames(sideNames);
            setInstructions(steps);
            //setError(JSON.stringify(instructions))
            setError(asdf)
            //setInstructionForms([]);
            // for (let i = 0; i < Object.keys(steps).length; i++) {
            //
            //
            //     // const copy5 = instructions;
            //     // copy5[i.toString()] = steps[i.toString()];
            //     // setInstructions(copy5);
            //     addInstructionRow();
            //     // instructionForms.push({ id: (i+1).toString(), name: addInstructionForm(i.toString()), delete: <BsFillTrashFill onClick={(event) => deleteIngredient(event, i)}/> });
            // }

            let tagString = ""
            tag.forEach(t => {
              tagString += t + " "
            })
            if (tagString.length > 1) {
                tagString.substring(0, tagString.length - 1); // Drop the extra " " at the end
            }
            setTags(tagString);
            setNotes(blurb);
            setImage(imageLink);

            if (recipeType == "Public") {
                setSwitchValue(true);
            } else {
                setSwitchValue(false);
            }

        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }

    function generateCoreIngredientForms() {
        let forms = [];
        for (let i = 0; i < Object.keys(coreIngredientQuantities).length; i++) {
            forms.push(
                <div>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1" style={{marginLeft: "1rem", display: "inline-block", width: "30%"}}>
                        <Form.Control
                            type="name"
                            placeholder={"Quantity"}
                            value={coreIngredientQuantities[i]}
                            onChange={e => setField('name', e.target.value, i, 1)}
                            style={{backgroundColor: "#ededed", borderWidth: 0}}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1" style={{marginLeft: "1rem", display: "inline-block", width: "50%"}}>
                        <Form.Control
                            type="name"
                            placeholder={"Ingredient"}
                            value={coreIngredientNames[i]}
                            onChange={e => setField('name', e.target.value, i, 0)}
                            style={{backgroundColor: "#ededed", borderWidth: 0}}
                        />
                    </Form.Group>
                </div>)
        }
        return forms;
    }

    // TODO: ADD DELETE BUTTON BACK?

    function generateSideIngredientForms() {
        let forms = [];
        for (let i = 0; i < Object.keys(sideIngredientQuantities).length; i++) {
            forms.push(
                <div>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1" style={{marginLeft: "1rem", display: "inline-block", width: "30%"}}>
                        <Form.Control
                            type="name"
                            placeholder={"Quantity"}
                            value={sideIngredientQuantities[i]}
                            onChange={e => setField('name', e.target.value, i, 3)}
                            style={{backgroundColor: "#ededed", borderWidth: 0}}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1" style={{marginLeft: "1rem", display: "inline-block", width: "50%"}}>
                        <Form.Control
                            type="name"
                            placeholder={"Ingredient"}
                            value={sideIngredientNames[i]}
                            onChange={e => setField('name', e.target.value, i, 2)}
                            style={{backgroundColor: "#ededed", borderWidth: 0}}
                        />
                    </Form.Group>
                </div>)
        }
        return forms;
    }

    function generateInstructionForms() {
        let forms = [];
        for (let i = 0; i < Object.keys(instructions).length; i++) {
            forms.push(
                <div>
                    <span style={{fontWeight: "bold"}}>{(i + 1).toString()}</span>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1" style={{marginLeft: "1rem", display: "inline-block", width: "75%"}}>
                    <Form.Control
                        type="name"
                        placeholder={"Instruction"}
                        value={instructions[i.toString()]}
                        onChange={e => setField('name', e.target.value, i, 4)}
                        style={{backgroundColor: "#ededed", borderWidth: 0}}
                    />
                </Form.Group>
                </div>)
        }
        return forms;
    }

    useEffect(() => {

        if (props.areEditing) {
            fillInformation();

            // Update button text
            setEditState("Update");
        } else {
            // Update button text
            setEditState("Create");
        }
    }, []);

    return (
        <div className='contentInsets' style={{paddingRight: '50%'}}>
            <div className='leftContentInsets'>
            <div className='pageTitle'>{editState} Recipe</div>
            <div className='pageSubtitle' >Recipe Name</div>
            <div><Form><Form.Control size='lg' placeholder='Recipe Name' value={recipeName} onChange={e => setRecipeName(e.target.value)} style={{backgroundColor: "#ededed", borderWidth: 0}} /></Form></div>
            <br/>
			<div className='pageSubtitle'>Core Ingredients</div>
            <div style={{width: "100%"}}>{generateCoreIngredientForms()}</div>
            <div  className='leftContentInsets' style={{width: "100%"}}>
                <Button onClick={() => addCoreIngredientRow()} >
                    Add Row
                </Button>
            </div>
			<br/>

            <div className='pageSubtitle'>Side Ingredients</div>
            <div>{generateSideIngredientForms()}</div>
            <div className='leftContentInsets'>
                <Button onClick={() => addSideIngredientRow()}>
                    Add Row
                </Button>
            </div>
			<br/>

            <div className='pageSubtitle'>Instructions</div>
            <div >{generateInstructionForms()}</div>
            <div  className='leftContentInsets' style={{marginLeft: "12px"}}><Button onClick={() => addInstructionRow()}>
                Add Step
            </Button></div>
			<br/>

            <div className='pageSubtitle'>Tags</div>
            <div><Form><Form.Control size='lg' placeholder='Enter up to 5 comma seperated tags' value={tags} onChange={e => setTags(e.target.value)} style={{backgroundColor: "#ededed", borderWidth: 0}}/></Form></div>

            <div className='pageSubtitle'>Image</div>
            <div><Form><Form.Control size='lg' placeholder='Enter image link'value={image} onChange={e => setImage(e.target.value)} style={{backgroundColor: "#ededed", borderWidth: 0}}/></Form></div>

           {/*<div>*/}
           {/*     <input type="file" name="file" onChange={changeHandler} />*/}
           {/*     {isSelected ? (*/}
           {/*         <div>*/}

           {/*              <p>Filename: {selectedFile.name}</p>*/}
           {/*             <p>Filetype: {selectedFile.type}</p>*/}
           {/*             <p>Size in bytes: {selectedFile.size}</p>*/}
           {/*             <p>*/}
           {/*                 lastModifiedDate:{' '}*/}
           {/*                 {selectedFile.lastModifiedDate.toLocaleDateString()}*/}
           {/*             </p>*/}
           {/*         </div>*/}
           {/*     ) : (*/}
           {/*         <p>Select a file to show details</p>*/}
           {/*     )}*/}
           {/*     <div>*/}
           {/*         <button onClick={handleSubmission}>Submit</button>*/}
           {/*     </div>*/}
           {/* </div>*/}


            <div className='pageSubtitle'>Other Information</div>
            <div><Form><Form.Control as='textarea' placeholder='Notes' rows='4' value={notes} onChange={e => setNotes(e.target.value)} style={{backgroundColor: "#ededed", borderWidth: 0}}/></Form></div>

            <div style={{marginTop: "1.5rem"}}>
                <label style={{fontSize: 22, paddingRight: '10px', verticalAlign: 'top'}}>Is Public</label>
                <span style={{verticalAlign: 'bottom'}}>
                    <Switch onChange={toggleSwitch}
                        checked={switchValue}
                        checkedIcon={false}
                        uncheckedIcon={false}
                />
                </span>
            </div>
            <div style={{color: 'red', paddingTop: '1rem', fontSize: 17}}>{error}</div>
            <div>
                <Button style={{width: "150px", marginTop: "2rem"}} onClick={() => createRecipe()}>
                    {editState}
                </Button>
                <div>
                    <Popup trigger={<Button style={{width: "150px", marginTop: "0.5rem"}} >Preview</Button>} open = {showPreviewPopup} arrow={true}>
                        <div style={{backgroundColor: "white", padding: "2rem", borderRadius: "12px",
                            boxShadow: "0px 0px 13px #aaaaaa", align: "center", float: "center", display: "block",
                            width: "100%", height: "100%", overflowY: "auto", position: "fixed", top: "0", left: "0"}}>
                            <div>{React.createElement(RecipePreview,
                                {id: props.id, coreIngredientsNames: coreIngredientNames, sideIngredientsNames: sideIngredientNames,
                                    coreIngredientsQuantities: coreIngredientQuantities, sideIngredientsQuantities: sideIngredientQuantities,
                                    instructions: instructions, tags: tags.split(',').map(tag => tag.trim()), blurb: notes,
                                    author: uid, image: image})}</div>
                            <Button onClick={e=>closePreviewPopup(e)}>Back</Button>
                        </div>
                    </Popup></div>
            </div>
            </div>

        </div>
    );

    function checkProfile(field, type) {
        const empty = (field.toString().trim().length === 0)
        if (empty) setError(type + " is empty! Set one to create a recipe.")
        return empty
    }

    async function closePreviewPopup(e) {
        e.preventDefault();
        setShowPreviewPopup(true);
        // Ok so this shouldn't be here... but if I don't run something, then the show edit popup isn't set to false :(
        // I assume the compiler is optimizing whatever out
        await getDocs(query(collection(db, "Users")));

        setShowPreviewPopup(false);
    }

    async function createRecipe() {

        // Check the user is logged in
        if (!uid) {
            setError("You must be logged in to create a recipe.");
            return;
        }

        // Ensure user has their profile information set
        const user = (await db.collection("Users").doc(uid).get()).data()
        if (checkProfile(user.firstName, "First Name")) return
        if (checkProfile(user.lastName, "Last Name")) return
        if (checkProfile(user.username, "Username")) return

        // Check that it has a name
        if (recipeName === "") {
            setError("You must provide a name for your recipe.");
            return;
        }

        // Check that there is at least one ingredient
        if (Object.keys(coreIngredientNames).length === 0 && Object.keys(sideIngredientNames).length === 0) {
            setError("Your recipe must contain at least one ingredient.");
            return;
        }

        // Check that there is at least on instruction
        if (Object.keys(instructions).length === 0) {
            setError("You must provide at least one instruction for your recipe.");
            return;
        }

        if (tags.split(",").length > 5) {
            setError(`You are limited to 5 tags. You currently have ${tags.split(",").length}.`);
            return;
        }

        // No errors
        setError("")

        // Save recipe core ingredients
        let coreIngredients = []
        for (let i = 0; i < Object.keys(coreIngredientNames).length; i++) {
            const bothEmpty = (coreIngredientNames["i"] === "" && coreIngredientQuantities["i"] === ""); // To compensate for lack of delete button
            if (!bothEmpty) {
                if (!(i in coreIngredientNames) || (coreIngredientNames[i] === "") || !(i in coreIngredientQuantities) || (coreIngredientQuantities[i] === "")) {
                    setError("Please make sure all core ingredients have both an ingredient and a quantity.");
                    return;
                }
                let ingredient = {name: coreIngredientNames[i], quantity: coreIngredientQuantities[i]};
                coreIngredients.push(ingredient);
            }
        }

        // Save recipe side ingredients
        let sideIngredients = []
        for (let i = 0; i < Object.keys(sideIngredientNames).length; i++) {
            const bothEmpty = (sideIngredientNames["i"] === "" && sideIngredientQuantities["i"] === ""); // To compensate for lack of delete button
            if (!bothEmpty) {
                if (!(i in sideIngredientNames) || !(i in sideIngredientQuantities)) {
                    setError("Please make sure all side ingredients have both an ingredient and a quantity.")
                    return;
                }
                let ingredient = {name: sideIngredientNames[i], quantity: sideIngredientQuantities[i]};
                sideIngredients.push(ingredient);
            }
        }

        const recipe = {
            name: recipeName,
            coreIngredients: coreIngredients,
            sideIngredients: sideIngredients,
            instructions: instructions,
            author: uid,
            upvotedList: [],
            downvotedList: [],
            madeList: [],
            recipeType: switchValue ? "Public" : "Private",
            tags: tags.split(',').map(tag => tag.trim()),
            image: image,
            blurb: notes,
        }


        if (props.areEditing) {
            // Editing a recipe
            let recipeRef = doc(db, "Recipes", props.id);
            const docRef = await updateDoc(recipeRef, recipe);
            toast.success("Recipe updated!");
            //setError(docRef.id);

        } else {
            // Creating a recipe

            // Add recipe to database
            let recipeRef = collection(db, "Recipes");
            const docRef = await addDoc(recipeRef, recipe);

            toast.success("Recipe created!");
            setError(docRef.id);

            // Add recipe id under list of user's created recipes
            let userCreatedRecipesRef = doc(db, "Users", uid);
            await updateDoc(userCreatedRecipesRef, { createdRecipes: arrayUnion(docRef.id) });
        }



    }

}
