

import _ from "lodash";
import { Row, Col, Container, Image } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import logo from "../../../assets/logo/logo.jpg";
import "./Catalogue.scss";
import CatalogueInterface from "../../interface/CatalogueInterface";
import Post from ".././../components/Post/Post";

function Catalogue(props) {
  const [searchString, setSearchString] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(undefined);
  const [selectedSubCategory, setSelectedSubCategory] = useState(undefined);
  const [posts, setPosts] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  useEffect(() => {
    reloadStores();
  }, [searchString, selectedCategory]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    CatalogueInterface.getCategories().then((categories) => {
      setAvailableCategories(categories.data.data);
    });
  };

  const loadSubCategories = (category) => {
    CatalogueInterface.getSubCategories({
      category: category,
    }).then((subCategories) => {
      setSubCategories(subCategories.data.data || []);
    });
  };

  const categoryChanged = (category) => {
    setSelectedCategory(category);
    loadSubCategories(category);
  };

  const reloadStores = () => {
    CatalogueInterface.getStores({
      searchString,
      selectedCategory,
    }).then((results) => {
      setPosts(_.get(results, "data.data"));
    });
  };

  return (
    <Container className="catalogue">
      <div className="page-header d-flex">
        <div className="profile-image-name">
          <div>
            <Image
              className="brand"
              roundedCircle
              src={logo}
              width="120rem"
              height="120rem"
            ></Image>
          </div>
          {/* <div className="pageName">Instalogue</div> */}
        </div>
        <div className="profile-stats-desc">
          <div className="stats">
            <div className="stat-entry">
              <span className="stat-count">102</span>
              <span className="stat-value third-header">followers</span>
            </div>
            <div className="stat-entry">
              <span className="stat-count">102</span>
              <span className="stat-value third-header">followers</span>
            </div>
            <div className="stat-entry">
              <span className="stat-count">102</span>
              <span className="stat-value third-header">followers</span>
            </div>
          </div>
          <div className="description second-grey">
            <span>
            Instagram is now home for numerous online stores, offering wonderful, rare collection of products.
            Instalogue index these stores to provide better searchability based on categories and subcategories. 
            </span>
            {/* While providing discoverability for online stores, instalogue aims at providing an online shopping mall experience. */}
          </div>
        </div>
      </div>
      <div className="highlight-filters mt-5">
        {availableCategories.map((highlight) => {
          return (
            <div>
              <div
                className="highlight"
                className={highlight == selectedCategory ? "selected" : ""}
                onClick={() => {
                  selectedCategory == highlight
                    ? categoryChanged(undefined)
                    : categoryChanged(highlight);
                }}
              >
                <div
                  className={
                    highlight == selectedCategory
                      ? "selected highlight-container cursor-pointer"
                      : "highlight-container cursor-pointer"
                  }
                >
                  <Image
                    roundedCircle
                    src={window.location.origin+"/categories/" + highlight +".jpg"}
                    alt={highlight}
                    title={highlight}
                  ></Image>
                </div>
              </div>
              <div
                className={
                  highlight == selectedCategory
                    ? "selected highlight-key mt-1"
                    : "highlight-key mt-1"
                }
              >
                <span className="second-grey">{highlight}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="posts mt-3">
        <Row>
          {posts.map((post) => {
            return (
              <Col md="4" sm="4" lg="4" xs="4" className="p-2">
                <Post postinfo={post}></Post>
              </Col>
            );
          })}
        </Row>
      </div>
    </Container>
  );
}

export default Catalogue;
