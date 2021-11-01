import _ from "lodash";
import { Row, Col, Container, Image } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import logo from "../../../assets/logo/logo.jpg";
import logopng from "../../../assets/logo/logo.png";
import "./Catalogue.scss";
import CatalogueInterface from "../../interface/CatalogueInterface";

function Catalogue(props) {
  const [searchString, setSearchString] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(undefined);
  const [posts, setPosts] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  useEffect(() => {
    CatalogueInterface.getStores({
      searchString,
      selectedCategory,
    }).then((results) => {
      setPosts(_.get(results, "data.data"));
    });
  });

  return (
    <Container className="catalogue">
      <div className="page-header d-flex">
        <div className="profile-image-name">
          <div>
            <Image
              className="brand"
              roundedCircle
              src={logo}
              width="200px"
            ></Image>
          </div>
          {/* <div className="pageName">Instalogue</div> */}
        </div>
        <div className="profile-stats-desc">
          <div className="stats">
            <div className="stat-entry">
              <span className="stat-count">102</span>
              <span className="stat-value">followers</span>
              </div>
            <div className="stat-entry">
              <span className="stat-count">102</span>
              <span className="stat-value">followers</span>
              </div>
            <div className="stat-entry">
              <span className="stat-count">102</span>
              <span className="stat-value">followers</span>
              </div>
          </div>
          <div className="description">
            Thank you! Spent a long time trying to fix a similar error where
            /node_modules/@ionic/core/dist/ionic/svg/index.js was giving an
            error when trying to run unit tests and only happened when using
            Ionic Platform
          </div>
        </div>
      </div>
      <div className="highlight-filters mt-5">
        {availableCategories.map((highlight) => {
          return (
            <div className="highlight-container cursor-pointer">
              <Image className="brand" roundedCircle src={logo}></Image>
            </div>
          );
        })}
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
                  <Image className="post" src={logopng}></Image>
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
