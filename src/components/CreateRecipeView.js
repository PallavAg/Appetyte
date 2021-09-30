import React, {useRef, useState} from "react";
import {Button, Form, Row, Col} from "react-bootstrap";
import Switch from "react-switch";
import BootstrapTable from "react-bootstrap-table-next";
import firebase from "../firebase";

export default function CreateRecipeView() {

    const [products, setProducts] = useState(
        [
            { id: "1", name: addForm("Instruction"), delete: <Button>Trash Icon</Button> },
            { id: "2", name: addForm("Instruction"), delete: <Button>Trash Icon</Button> },
        ]
    );
    const [coreIngredients, setCoreIngredients] = useState(
        [
            { quantity: addForm("Quantity"), name: addForm("Ingredient"), delete: <Button>Trash Icon</Button> },
            { quantity: addForm("Quantity"), name: addForm("Ingredient"), delete: <Button>Trash Icon</Button> },
        ]
    )
    const [sideIngredients, setSideIngredients] = useState(
        [
            { quantity: addForm("Quantity"), name: addForm("Ingredient"), delete: <Button>Trash Icon</Button> },
            { quantity: addForm("Quantity"), name: addForm("Ingredient"), delete: <Button>Trash Icon</Button> },
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

    const rowStyle = (row, rowIndex) => {
        return 'backgroundColor: red';
    };

    function addForm(placeholder) {
        return (<Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Control type="email" placeholder={placeholder} />
            </Form.Group>
        </Form>)
    }

    function addInstructionRow() {
        let index = products.length + 1
        setProducts(products => ([...products, {id: index, name: addForm("New Ingredient"), delete: <Button>Trash Icon</Button> }]));
    }

    function addCoreIngredientRow() {
        let index = coreIngredients.length + 1
        setCoreIngredients(coreIngredients => ([...coreIngredients, {quantity: addForm("Quantity"), name: addForm("Ingredient"), delete: <Button>Trash Icon</Button> }]));
    }

    function addSideIngredientRow() {
        let index = sideIngredients.length + 1
        setSideIngredients(sideIngredients => ([...sideIngredients, {quantity: addForm("Quantity"), name: addForm("Ingredient"), delete: <Button>Trash Icon</Button> }]));
    }

    const toggleSwitch = (value) => {
        //To handle switch toggle
        setSwitchValue(value);
        //State changes according to switch
    };

    const recipeName = useRef();
    const coreIngredientsRefs = useRef([]);
    const sideIngredientsRefs = useRef([]);
    const instructionsRefs = useRef([]);
    const notes = useRef();

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
                data={coreIngredients}
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
                data={sideIngredients}
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
                data={products}
                columns={columns}
            />
            <div className='leftContentInsets'><Button onClick={() => addInstructionRow()}>
                Add Step
            </Button></div>

            <div className='pageSubtitle'>Other Information</div>
            <div style={{paddingLeft: '1rem', paddingRight: '1rem'}}><Form><Form.Control as='textarea' placeholder='Notes' rows='4' ref={notes}></Form.Control></Form></div>

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



            {/*<Form>*/}
            {/*    <Row>*/}
            {/*        <Col>*/}
            {/*            <Form.Control placeholder='Quantity' />*/}
            {/*        </Col>*/}
            {/*        <Col>*/}
            {/*            <Form.Control placeholder='Name'/>*/}
            {/*        </Col>*/}
            {/*        <Col>*/}
            {/*            <Button onClick={() => addCoreIngredientRow()}>*/}
            {/*                Add Core Ingredient*/}
            {/*            </Button>*/}
            {/*        </Col>*/}
            {/*    </Row>*/}
            {/*</Form>*/}
        </div>
    );

    async function createRecipe() {

        // Check that it has a name
        if (recipeName == "") {
            setError("You must provide a name for your recipe.");
            return;
        }
        // Check that there is at least one ingredient
        if (coreIngredientsRefs.current.length == 0 && sideIngredientsRefs.current.length == 0) {
            setError("Your recipe must contain at least one ingredient.");
            return;
        }
        // Check that there is at least on instruction
        if (instructionsRefs.current.length == 0) {
            setError("You must provide at least one instruction for your recipe.");
            return;
        }

        // No errors
        setError("")

        var recipe = []

        // Save recipe name
        recipe["name"] = recipeName;

        // Save recipe core ingredients

        // Save recipe side ingredients

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
