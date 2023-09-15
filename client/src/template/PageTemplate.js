import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { BsListCheck } from "react-icons/bs";

import { useNavigate, Navigate } from "react-router-dom";
import axios from "axios";

const PageTemplate = (props) => {
  const { filteredClients, user, setUser } = props;
  const navigate = useNavigate();
  const [afuera, setAfuera] = useState(false);
  /* console.log(props) */

  const handelHome = () => {
    navigate("/clients");
  };

  const logout = () => {
    setAfuera(true);
  };

  useEffect(() => {
    if (afuera) {
      const instance = axios.create({ baseURL: "http://localhost:8000" });
      instance
        .get("/user/logout", { withCredentials: true })
        .then((response) => {
          /* console.log(response); */
          setAfuera(false);
          setUser(null);
          localStorage.clear();
          console.log("useruser :  " + user);
          /* navigate('/login'); */
        })
        .catch((error) => console.log("error"));
    }
  }, [afuera]);

  return (
    <div>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-center gap-5"
          >
            <Container className="d-flex align-items-center justify-content-between">
              <div
                style={{ minHeight: "40px", minWidth: "40px" }}
                onClick={handelHome}
                class = "d-flex align-items-center justify-content-between"
              >
                <BsListCheck size={"40px"} className="me-4 text-white" />
                <Navbar.Brand className="fs-3  ">CheckList</Navbar.Brand>
              </div>
              <Navbar.Brand className="fs-3 pe-5 me-5">
                {props.title}
              </Navbar.Brand>
              {props.isclient ? (
                <Form className="d-flex col-3 me-0" inline>
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
                      <Button className="btn btn-light" onClick={logout}>
                        Log Out
                      </Button>
                    </Col>
                  </Row>
                </Form>
              ) : (
                "null"
              )}
            </Container>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div>{props.children}</div>
      <footer className="bg-dark text-light d-flex flex-wrap justify-content-between align-items-center py-3 mt-4 border-top ">
        <Container className="pt-3">
          <Row className="d-flex justify-content-between">
            <Col className="text-center">
              <h3>Develop by</h3>
              <div>
                <p>Jaime Suazo</p>
                <p>Luis palominos</p>
              </div>
            </Col>
            <Col className="text-center">
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
  );
};

export default PageTemplate;
