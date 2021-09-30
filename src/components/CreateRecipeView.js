import React, {useState} from "react";
import {Button, Form, Row, Col} from "react-bootstrap";
import Switch from "react-switch";
import BootstrapTable from "react-bootstrap-table-next";

export default function CreateRecipeView() {

    const [products, setProducts] = useState(
        [
            { id: "1", name: "Preheat oven", delete: <Button>Trash Icon</Button> },
            { id: "2", name: "Preheat oven3", delete: <Button>Trash Icon</Button> },
        ]
    );
    const [coreIngredients, setCoreIngredients] = useState(
        [
            { quantity: "1", name: "Chicken", delete: <Button>Trash Icon</Button> },
            { quantity: "2", name: "Potatoes", delete: <Button>Trash Icon</Button> },
        ]
    )
    const [sideIngredients, setSideIngredients] = useState(
        [
            { quantity: "1", name: "Salt", delete: <Button>Trash Icon</Button> },
            { quantity: "2", name: "Pepper", delete: <Button>Trash Icon</Button> },
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

    function addInstructionRow() {
        let index = products.length + 1
        setProducts(products => ([...products, {id: index, name: "New Ingredient", delete: <Button>Trash Icon</Button> }]));
    }

    function addCoreIngredientRow() {
        let index = coreIngredients.length + 1
        setCoreIngredients(coreIngredients => ([...coreIngredients, {id: index, name: "New Ingredient", delete: <Button>Trash Icon</Button> }]));
    }

    function addSideIngredientRow() {
        let index = sideIngredients.length + 1
        setSideIngredients(sideIngredients => ([...sideIngredients, {id: index, name: "New Ingredient", delete: <Button>Trash Icon</Button> }]));
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
            />
            <div>
                <Form>
                    <Row>
                        <Col>
                            <Form.Control placeholder='Quantity' />
                        </Col>
                        <Col>
                            <Form.Control placeholder='Name'/>
                        </Col>
                        <Col>
                            <Button onClick={() => addCoreIngredientRow()}>
                                Add Core Ingredient
                            </Button>
                        </Col>
                    </Row>
                </Form>

            </div>
            <div className='pageSubtitle'>Side Ingredients</div>
            <BootstrapTable
                bootstrap4
                keyField="id"
                data={sideIngredients}
                columns={ingredientColumns}
            />
            <Form>
                <Row>
                    <Col>
                        <Form.Control placeholder='Quantity' />
                    </Col>
                    <Col>
                        <Form.Control placeholder='Name'/>
                    </Col>
                    <Col>
                        <Button onClick={() => addSideIngredientRow()}>
                            Add Side Ingredient
                        </Button>
                    </Col>
                </Row>
            </Form>
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
        </div>
    );

}
