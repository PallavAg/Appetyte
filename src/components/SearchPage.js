import React, {useState} from "react"
import RecipePreviewCard from "./Subviews/RecipePreviewCard";
import {Button, Form, Row, Col} from "react-bootstrap";

export default function SearchPage() {

    return (
        <div className='contentInsets'>
            <div className='pageTitle'>Search</div>
            <div style={{backgroundColor: 'steelblue', borderRadius: 15, padding: '1rem'}}>
                <Form>
                    <Form.Group className="mb-3" controlId="search">
                        <Row>
                            <Col>
                                <Form.Control
                                    type="name"
                                    placeholder={"Search"}
                                    //id={id}
                                    //onChange={e => setField('name', e.target.value, id, 3)}
                                />
                            </Col>
                            <Col md="auto">
                                <Button>Search</Button>
                            </Col>
                        </Row>

                    </Form.Group>
                </Form>
            </div>
            <div className='leftAndRightContentInsets' style={{backgroundColor: 'lightgray', paddingTop: '1rem', paddingBottom: '1rem'}}>

                <div style={{paddingLeft: '1rem', paddingRight: '1rem'}}>{RecipePreviewCard("Turducken", [{name: "Turkey"}, {name: "Duck"}, {name: "Chicken"}, {name: "Chicken2"}, {name: "Chicken3"}, {name: "Chicken4"}])}</div>


            </div>

        </div>
    );

}
