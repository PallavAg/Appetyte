import React, {useRef, useState} from "react";
import {Button, Form, Row, Col} from "react-bootstrap";
import Switch from "react-switch";
import BootstrapTable from "react-bootstrap-table-next";
import firebase from "../firebase";
import {BsFillTrashFill} from "react-icons/bs";

export default function CreateRecipeView() {

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
        {
            dataField: "delete",
            text: ""
        }
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
        {
            dataField: "delete",
            text: ""
        }
    ];


    // whichList: 0 -> coreIngredientNames
    //            1 -> coreIngredientQuantities
    //            2 -> sideIngredientNames
    //            3 -> sideIngredientQuantities
    //            4 -> instructions
    const setField = (field, value, id, whichList) => {
        let copy = {};
        switch (whichList) {
            case 0:
                copy = {...coreIngredientNames}
                copy[id] = value;
                setCoreIngredientNames(copy);
                break;
            case 1:
                copy = {...coreIngredientQuantities}
                copy[id] = value;
                setCoreIngredientQuantities(copy);
                break;
            case 2:
                copy = {...sideIngredientNames}
                copy[id] = value;
                setSideIngredientNames(copy);
                break;
            case 3:
                copy = {...sideIngredientQuantities}
                copy[id] = value;
                setSideIngredientQuantities(copy);
                break;
            case 4:
                copy = {...instructions}
                copy[id] = value;
                setInstructions(copy);
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
                    //id={id}
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
        let index = instructionForms.length + 1
        setInstructionForms(products => ([...products, {id: index, name: addInstructionForm(index), delete: <BsFillTrashFill onClick={(event) => deleteIngredient(event, index)}/> }]));
    }

    function addCoreIngredientRow() {
        let index = coreIngredientForms.length + 1
        setCoreIngredientForms(coreIngredients => ([...coreIngredients, {quantity: addCoreIngredientQuantityForm(index), name: addCoreIngredientNameForm(), delete: <BsFillTrashFill onClick={(event) => deleteIngredient(event, index)}/> }]));
    }

    function addSideIngredientRow() {
        let index = sideIngredientForms.length + 1
        setSideIngredientForms(sideIngredients => ([...sideIngredients, {quantity: addCoreIngredientQuantityForm(index), name: addCoreIngredientNameForm(), delete: <BsFillTrashFill onClick={(event) => deleteIngredient(event, index)}/> }]));
    }

    const toggleSwitch = (value) => {
        //To handle switch toggle
        setSwitchValue(value);
        //State changes according to switch
    };

    const recipeName = useRef();
    const [notes, setNotes] = useState("");

    const [switchValue, setSwitchValue] = useState(true);
    const [error, setError] = useState("");

    return (
        <div className='contentInsets'>
            <div className='pageTitle'>Create Recipe</div>
            <div className='pageSubtitle'>Recipe Name</div>
            <div><Form><Form.Control size='lg' placeholder='Recipe Name' ref={recipeName}></Form.Control></Form></div>
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

        setError(notes);
        //setError(Object.keys(myIngredients).length);
        return;

        // Check that it has a name
        if (recipeName == "") {
            setError("You must provide a name for your recipe.");
            return;
        }

        // TODO: CHECK SAME NUMBER OF QUANTITIES AND NAMES AND THAT BOTH ARE FILLED IN WITH SAME INDEX

        // Check that there is at least one ingredient
        if (coreIngredientNames.current.length == 0 && sideIngredientNames.current.length == 0) {
            setError("Your recipe must contain at least one ingredient.");
            return;
        }

        if (coreIngredientQuantities.current.length != coreIngredientNames.current.length) {
            setError("Please make sure all core ingredients have both an ingredient and a quantity.")
        } else {
            // TODO: Check that ingredient and quantities are paired up
        }

        if (sideIngredientQuantities.current.length != sideIngredientNames.current.length) {
            setError("Please make sure all side ingredients have both an ingredient and a quantity.")
        }

        // Check that there is at least on instruction
        if (instructions.current.length == 0) {
            setError("You must provide at least one instruction for your recipe.");
            return;
        }

        // No errors
        setError("")

        var recipe = []

        // Save recipe name
        recipe["name"] = recipeName;

        // Save recipe core ingredients
        let coreIngredients = []
        for (let i = 0; i < coreIngredientNames.length; i++) {
            let ingredient = {name: coreIngredientNames[i].name, quantity: coreIngredientQuantities[i].quantity};
            coreIngredientNames.push(ingredient);
        }
        recipe["coreIngredients"] = coreIngredients;

        // Save recipe side ingredients
        let sideIngredients = []
        for (let i = 0; i < sideIngredientNames.length; i++) {
            let ingredient = {name: sideIngredientNames[i].name, quantity: sideIngredientQuantities[i].quantity};
            sideIngredientNames.push(ingredient);
        }
        recipe["sideIngredients"] = sideIngredients;

        // Save recipe notes
        recipe["blurb"] = notes;

        // Save is recipe public toggle
        if (switchValue == 0) {
            recipe["RecipeType"] = "Private"
        }
        else if (switchValue == 1) {
            recipe["RecipeType"] = "Public";
        }

        // Save recipe author id
        // TODO: Set to use userID
        recipe["author"] = "TEST -- NEEDS TO BE SET TO USER ID"

        // Set upvote and downvotes to 0
        recipe["upvoteCount"] = 0;
        recipe["downvoteCount"] = 0;

        // Add recipe to database
        // TODO: Update userID
        //firebase.firestore().collection("Users").doc("USER ID").collection("CreatedRecipes").add(recipe)
        //const result = await setDoc(doc(db, "Users", "USER ID", "CreatedRecipes"), recipe);
        // TODO: Check result for errors
    }

}
