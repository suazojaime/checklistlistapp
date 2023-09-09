import React, {useEffect, useState} from 'react'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { useNavigate } from "react-router-dom";
import axios from 'axios';

const PageTemplate = (props) => {
    const {filteredClients} = props
    const navigate =  useNavigate();
    const [afuera,setAfuera]=useState(false);

    const logout =()=>{
        setAfuera(true);
        if(afuera){
            const instance = axios.create({baseURL: 'http://localhost:8000'})
            instance.get('/user/logout',{ withCredentials: true})
            .then(response =>  {console.log(response)
            navigate('/login')
            setAfuera(false)
            })
            .catch((error) => console.log('error'))
        }
    }




    return (
        <div>
            <Navbar  bg="dark" data-bs-theme="dark" >
                <Container>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center gap-5">
                        <Navbar.Brand >{props.title}</Navbar.Brand>
                        {props.isclient?
                            <Form inline>
                                <Row>
                                <Col xs="auto">
                                    <Form.Control
                                    type="text"
                                    placeholder="Search"
                                    className=" mr-sm-2"
                                    onChange={(e) => filteredClients(e)}
                                    />
                                </Col>
                                <Col xs="auto">
                                    <Button  className='btn btn-light' onClick={logout}>Log Out</Button>
                                </Col>
                                </Row>
                            </Form>: null
                        }
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <div >{props.children}</div>
            <footer className="bg-dark text-light d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top ">
                <Container className='pt-3'>
                    <Row className='d-flex justify-content-between'>
                    <Col className='text-center'>
                        <h3>Develop by</h3>
                        <div>
                        <p>Jaime Suazo</p>
                        <p>Luis palominos</p>
                        </div>
                    </Col>
                    <Col className='text-center'>
                        <h3>Contact Us</h3>
                        <address>
                        <p>Email: contact@example.com</p>
                        <p>Phone: +1 123-456-7890</p>
                        </address>
                    </Col>
                    </Row>
                    <Row>
                    <Col>
                        <p className="text-center">&copy; 2023 Your Company</p>
                    </Col>
                    </Row>
                </Container>
            </footer>
        </div>
    )
}

export default PageTemplate