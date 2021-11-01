import React, { useState, useEffect } from "react";
import { Button, Col, Row, Container, DropdownButton, Dropdown } from "react-bootstrap";
import "./header.scss";

// import reactGA from "react-ga";

const Header = (props) => {
  useEffect(() => {
   
  }, []);


  return (
    <Col className="header-container">
      <Row>
        <Container className="appHeader ">
          <div className="brand">Instalogue</div>
          <div className="searchbar">Searchbar</div>
        </Container>
      </Row>
    </Col>
  );
};

export default Header;
