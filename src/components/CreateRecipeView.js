import React, {useState} from "react";
import {Button, Form, Row, Col} from "react-bootstrap";
import Switch from "react-switch";
import BootstrapTable from "react-bootstrap-table-next";

export default function CreateRecipeView() {

    const [products, setProducts] = useState(
        [
            { id: "1", name: addInstructionForm(), delete: <Button>Trash Icon</Button> },
            { id: "2", name: addInstructionForm(), delete: <Button>Trash Icon</Button> },
        ]
    );
    const [coreIngredients, setCoreIngredients] = useState(
        [
            { quantity: "1", name: addIngredientForm(), delete: <Button>Trash Icon</Button> },
            { quantity: "2", name: addIngredientForm(), delete: <Button>Trash Icon</Button> },
        ]
    )
    const [sideIngredients, setSideIngredients] = useState(
        [
            { quantity: "1", name: addIngredientForm(), delete: <Button>Trash Icon</Button> },
            { quantity: "2", name: addIngredientForm(), delete: <Button>Trash Icon</Button> },
        ]
    )

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
            text: "Delete"
        }
    ];

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
            text: "Delete"
        }
    ];

    const rowStyle = (row, rowIndex) => {
        return 'backgroundColor: red';
    };

    function addIngredientForm() {
        return (<Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Control type="email" placeholder="Ingredient" />
            </Form.Group>
        </Form>)
    }

    function addInstructionForm() {
        return (<Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Control type="email" placeholder="Instruction" />
            </Form.Group>
        </Form>)
    }

    function addInstructionRow() {
        let index = products.length + 1
        setProducts(products => ([...products, {id: index, name: "New Ingredient", delete: <Button>Trash Icon</Button> }]));
    }

    function addCoreIngredientRow() {
        let index = coreIngredients.length + 1
        setCoreIngredients(coreIngredients => ([...coreIngredients, {quantity: index, name: addIngredientForm(), delete: <Button>Trash Icon</Button> }]));
    }

    function addSideIngredientRow() {
        let index = sideIngredients.length + 1
        setSideIngredients(sideIngredients => ([...sideIngredients, {quantity: index, name: addIngredientForm(), delete: <Button>Trash Icon</Button> }]));
    }

    return (
        <div className='contentInsets'>
            <div className='pageTitle'>Create Recipe</div>
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
            />
            <div>
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
            <Button onClick={() => addSideIngredientRow()}>
                Add Row
            </Button>
            <div className='pageSubtitle'>Instructions</div>
            <BootstrapTable
                bootstrap4
                keyField="id"
                data={products}
                columns={columns}
            />
            <div><Button onClick={() => addInstructionRow()}>
                Add Step
            </Button></div>

            <div style={{marginTop: "1rem"}}>Is Public<Switch/></div>
            <div>
                <Button style={{width: "150px", marginTop: "2rem"}}>
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

}
