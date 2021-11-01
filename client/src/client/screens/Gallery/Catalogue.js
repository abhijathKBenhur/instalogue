import _ from "lodash";
import { Row, Col, Container, Image } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import logo from "../../../assets/logo/logo.jpg";
import "./Catalogue.scss";

function Catalogue(props) {
  return (
    <Container className="catalogue">
      <div className="page-info d-flex">
        <div className="profile-image">
          <Image
            className="brand"
            roundedCircle
            src={logo}
            width="200px"
          ></Image>
        </div>
        <div className="profile-info">
          Thank you! Spent a long time trying to fix a similar error where
          /node_modules/@ionic/core/dist/ionic/svg/index.js was giving an error
          when trying to run unit tests and only happened when using Ionic
          Platform
        </div>
      </div>
      <div className="categories mt-5">
        <div className="highlight-container cursor-pointer">
          <Image className="brand" roundedCircle src={logo}></Image>
        </div>
        <div className="highlight-container cursor-pointer">
          <Image className="brand" roundedCircle src={logo}></Image>
        </div>
        <div className="highlight-container cursor-pointer">
          <Image className="brand" roundedCircle src={logo}></Image>
        </div>
        <div className="highlight-container cursor-pointer">
          <Image className="brand" roundedCircle src={logo}></Image>
        </div>
        <div className="highlight-container cursor-pointer">
          <Image className="brand" roundedCircle src={logo}></Image>
        </div>
        <div className="highlight-container cursor-pointer">
          <Image className="brand" roundedCircle src={logo}></Image>
        </div>
        <div className="highlight-container cursor-pointer">
          <Image className="brand" roundedCircle src={logo}></Image>
        </div>
        <div className="highlight-container cursor-pointer">
          <Image className="brand" roundedCircle src={logo}></Image>
        </div>
        <div className="highlight-container cursor-pointer">
          <Image className="brand" roundedCircle src={logo}></Image>
        </div>
        <div className="highlight-container cursor-pointer">
          <Image className="brand" roundedCircle src={logo}></Image>
        </div>
        <div className="highlight-container cursor-pointer">
          <Image className="brand" roundedCircle src={logo}></Image>
        </div>
        <div className="highlight-container cursor-pointer">
          <Image className="brand" roundedCircle src={logo}></Image>
        </div>
        <div className="highlight-container cursor-pointer">
          <Image className="brand" roundedCircle src={logo}></Image>
        </div>
        <div className="highlight-container cursor-pointer">
          <Image className="brand" roundedCircle src={logo}></Image>
        </div>
        <div className="highlight-container cursor-pointer">
          <Image className="brand" roundedCircle src={logo}></Image>
        </div>
        <div className="highlight-container cursor-pointer">
          <Image className="brand" roundedCircle src={logo}></Image>
        </div>
        <div className="highlight-container cursor-pointer">
          <Image className="brand" roundedCircle src={logo}></Image>
        </div>
        <div className="highlight-container cursor-pointer">
          <Image className="brand" roundedCircle src={logo}></Image>
        </div>
        <div className="highlight-container cursor-pointer">
          <Image className="brand" roundedCircle src={logo}></Image>
        </div>
        <div className="highlight-container cursor-pointer">
          <Image className="brand" roundedCircle src={logo}></Image>
        </div>
        <div className="highlight-container cursor-pointer">
          <Image className="brand" roundedCircle src={logo}></Image>
        </div>
      </div>
      <div className="posts mt-3">
        <Row>
          {[
            1,
            2,
            3,
            4,
            5,
            6,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            19,
            20,
          ].map((item) => {
            return (
              <Col md="4" sm="4" lg="4" xs="4" className="p-2">
                <div className="post-container">
                  <Image className="post" src={logo}></Image>
                </div>
              </Col>
            );
          })}
        </Row>
      </div>
    </Container>
  );
}

export default Catalogue;
