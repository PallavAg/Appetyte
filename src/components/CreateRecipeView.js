import React, {useRef, useState} from "react";
import {Button, Form, Row, Col} from "react-bootstrap";
import Switch from "react-switch";
import BootstrapTable from "react-bootstrap-table-next";
import firebase, {db} from "../firebase";
import {BsFillTrashFill} from "react-icons/bs";
import {collection, addDoc} from "firebase/firestore";
import {useAuth} from "../contexts/AuthContext";

export default function CreateRecipeView() {

    const {uid} = useAuth();

    const [coreIngredientNames, setCoreIngredientNames] = useState({})
    const [coreIngredientQuantities, setCoreIngredientQuantities] = useState({})
    const [sideIngredientNames, setSideIngredientNames] = useState({})
    const [sideIngredientQuantities, setSideIngredientQuantities] = useState({})
    const [instructions, setInstructions] = useState({})

    const [instructionForms, setInstructionForms] = useState(
        [
            { id: "1", name: addInstructionForm("0"), delete: <BsFillTrashFill onClick={(event) => deleteIngredient(event, 0)}/> },
            { id: "2", name: addInstructionForm("1"), delete: <BsFillTrashFill onClick={(event) => deleteIngredient(event, 1)}/> },
        ]
    );
    const [coreIngredientForms, setCoreIngredientForms] = useState(
        [
            { quantity: addCoreIngredientQuantityForm("0"), name: addCoreIngredientNameForm("0"), delete: <BsFillTrashFill onClick={(event) => deleteIngredient(event, 0)}/> },
            { quantity: addCoreIngredientQuantityForm("1"), name: addCoreIngredientNameForm("1"), delete: <BsFillTrashFill onClick={(event) => deleteIngredient(event, 1)}/> },
        ]
    )
    const [sideIngredientForms, setSideIngredientForms] = useState(
        [
            { quantity: addSideIngredientQuantityForm("0"), name: addSideIngredientNameForm("0"), delete: <BsFillTrashFill onClick={(event) => deleteIngredient(event, 0)}/> },
            { quantity: addSideIngredientQuantityForm("1"), name: addSideIngredientNameForm("1"), delete: <BsFillTrashFill onClick={(event) => deleteIngredient(event, 1)}/> },
        ]
    )

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
        switch (whichList) {
            case 0:
                const copy1 = coreIngredientNames;
                copy1[id] = value;
                setCoreIngredientNames(copy1);
                break;
            case 1:
                const copy2 = coreIngredientQuantities;
                copy2[id] = value;
                setCoreIngredientQuantities(copy2);
                break;
            case 2:
                const copy3 = sideIngredientNames;
                copy3[id] = value;
                setSideIngredientNames(copy3);
                break;
            case 3:
                const copy4 = sideIngredientQuantities;
                copy4[id] = value;
                setSideIngredientQuantities(copy4);
                break;
            case 4:
                const copy5 = instructions;
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
        return (<Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Control
                    type="name"
                    placeholder={"Instruction"}
                    onChange={e => setField('name', e.target.value, id, 4)}
                />
            </Form.Group>
        </Form>)
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
        let index = instructionForms.length
        setInstructionForms(products => ([...products, {id: index, name: addInstructionForm(index), delete: <BsFillTrashFill onClick={(event) => deleteIngredient(event, index)}/> }]));
    }

    function addCoreIngredientRow() {
        let index = coreIngredientForms.length
        setCoreIngredientForms(coreIngredients => ([...coreIngredients, {quantity: addCoreIngredientQuantityForm(index), name: addCoreIngredientNameForm(index), delete: <BsFillTrashFill onClick={(event) => deleteIngredient(event, index)}/> }]));
    }

    function addSideIngredientRow() {
        let index = sideIngredientForms.length
        setSideIngredientForms(sideIngredients => ([...sideIngredients, {quantity: addCoreIngredientQuantityForm(index), name: addCoreIngredientNameForm(index), delete: <BsFillTrashFill onClick={(event) => deleteIngredient(event, index)}/> }]));
    }

    const toggleSwitch = (value) => {
        //To handle switch toggle
        setSwitchValue(value);
        //State changes according to switch
    };

    let recipeName = useRef();
    const [notes, setNotes] = useState("");

    const [switchValue, setSwitchValue] = useState(true);
    const [error, setError] = useState("");

    return (
        <div className='contentInsets'>
            <div className='pageTitle'>Create Recipe</div>
            <div className='pageSubtitle'>Recipe Name</div>
            <div><Form><Form.Control size='lg' placeholder='Recipe Name' ref={(ref) => {recipeName = ref}}></Form.Control></Form></div>
            <div className='pageSubtitle'>Core Ingredients</div>
            <BootstrapTable
                bootstrap4
                keyField="id"
                data={coreIngredientForms}
                columns={ingredientColumns}
                bordered={false}
                containerStyle={{borderRadius: 15}}
                headerStyle={{borderRadius: 15, backgroundClip: 'border-box'}}
                trStyle={{borderRadius: 15}}
                rowStyle={{backgroundColor: '#ebebeb', borderColor: 'white', borderRadius: 15}}
                bodyStyle={{borderRadius: 15}}
                tableStyle={{borderRadius: 15, bacgroundColor: 'green'}}
            />
            <div className='leftContentInsets'>
                <Button onClick={() => addCoreIngredientRow()}>
                    Add Row
                </Button>

            </div>
            <div className='pageSubtitle'>Side Ingredients</div>
            <BootstrapTable
                bootstrap4
                keyField="id"
                data={sideIngredientForms}
                columns={ingredientColumns}
                bordered={false}
                rowStyle={{backgroundColor: '#ebebeb', borderColor: 'white'}}
            />
            <div className='leftContentInsets'>
                <Button onClick={() => addSideIngredientRow()}>
                    Add Row
                </Button>
            </div>
            <div className='pageSubtitle'>Instructions</div>
            <BootstrapTable
                bootstrap4
                keyField="id"
                data={instructionForms}
                columns={columns}
                bordered={false}
                rowStyle={{backgroundColor: '#ebebeb', borderColor: 'white'}}
            />
            <div className='leftContentInsets'><Button onClick={() => addInstructionRow()}>
                Add Step
            </Button></div>

            <div className='pageSubtitle'>Other Information</div>
            <div style={{paddingLeft: '1rem', paddingRight: '1rem'}}><Form><Form.Control as='textarea' placeholder='Notes' rows='4' onChange={e =>  setNotes(e.target.value)}></Form.Control></Form></div>

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
                    Create
                </Button>
            </div>

        </div>
    );

    async function createRecipe() {

        // Check that it has a name
        if (recipeName.value == "") {
            setError("You must provide a name for your recipe.");
            return;
        }

        // Check that there is at least one ingredient
        if (Object.keys(coreIngredientNames).length == 0 && Object.keys(sideIngredientNames).length == 0) {
            setError("Your recipe must contain at least one ingredient.");
            return;
        }

        // Check that there is at least on instruction
        if (Object.keys(instructions).length == 0) {
            setError("You must provide at least one instruction for your recipe.");
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

        // Save is recipe public toggle
        let recipeType = "";
        if (switchValue == 0) {
            recipeType = "Private"
        }
        else if (switchValue == 1) {
            recipeType = "Public";
        }

        const recipe = {
            name: recipeName.value,
            coreIngredients: coreIngredients,
            sideIngredients: coreIngredients,
            author: uid,
            upvoteCount: 0,
            downvoteCount: 0,
            recipeType: recipeType,
            blurb: notes,
        }

        // Add recipe to database
        let recipeRef = collection(db, "Users", uid, "CreatedRecipes");
        const docRef = await addDoc(recipeRef, recipe)

        setError(docRef.id);
    }

}
