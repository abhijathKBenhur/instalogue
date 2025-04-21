import React, { useState, useEffect } from "react";
import { Button, Col, Row, Container, DropdownButton, Dropdown } from "react-bootstrap";
import "./header.scss";
import { useHistory } from "react-router-dom";
// import reactGA from "react-ga";

const Header = (props) => {
let history = useHistory();

  useEffect(() => {
   
  }, []);

  const goHome = () =>{
    history.push("/home");
  }


  return (
    <Col></Col>
    // <Col className="header-container">
    //   <Row className="h-100">
    //     <Container className="appHeader ">
    //       <span className="brand master-grey cursor-pointer" onClick={() => {goHome()}} >Instalogue.live</span>
    //       <div className="isntaicon">Searchbar</div>
    //     </Container>
    //   </Row>
    // </Col>
  );
};

export default Header;
