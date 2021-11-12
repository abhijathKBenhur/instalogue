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


  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableSubCategories, setAvailableSubCategories] = useState([]);


  const [isLoading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    reloadStores();
  }, [selectedSubCategory]);


  useEffect(() => {
    reloadStores();
    if(selectedCategory){
      loadSubCategories(selectedCategory)
    }else{
      setSelectedSubCategory(undefined)
      setAvailableSubCategories([])
    }
  }, [selectedCategory]);


  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    CatalogueInterface.getCategories().then((categories) => {
      let categoryList = _.get(categories, "data.data");
      setAvailableCategories(categoryList)
    });
  };

  const loadSubCategories = (category) => {
    setSelectedSubCategory(undefined)
    if (category || selectedCategory) {
      CatalogueInterface.getSubCategories({
        category: category || selectedCategory,
      }).then((subCategories) => {
        setAvailableSubCategories(subCategories.data.data)
      });
    }
  };


  const reloadStores = () => {
    setLoading(true);
    CatalogueInterface.getStores({
      searchString: searchString,
      selectedCategory: selectedCategory,
      selectedSubCategory: selectedSubCategory,
    }).then((results) => {
      setLoading(false);
      setPosts(_.get(results, "data.data"));
    });
  };

  return (
    <Container className="catalogue">
      {isLoading && <div className="loader"> </div>}
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
          <div className="pageName second-grey">Instalogue</div>
          <div className="pageDesc second-grey mt-1">Catalogue for Instastores</div>
        </div>
        <div className="profile-stats-desc">
          {/* <div className="stats">
            <div className="stat-entry">
              <span className="stat-count">{storeCount}</span>
              <span className="stat-value third-header">Stores</span>
            </div>
            <div className="stat-entry">
              <span className="stat-count">102</span>
              <span className="stat-value third-header">followers</span>
            </div>
            <div className="stat-entry">
              <span className="stat-count">102</span>
              <span className="stat-value third-header">followers</span>
            </div>
          </div> */}
          <div className="description second-grey">
            <span>
              Instagram is now home for numerous online stores with wonderful
              and vivid collection of products. Instalogue targets to index
              these pages and provide better discoverability for the products
              and increased choice for the consumers. Tap on highlights to
              filter. Happy browsing.
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
                className={
                  highlight == selectedCategory ? "selected" : ""
                }
                onClick={() => {
                  selectedCategory == highlight
                    ? setSelectedCategory(undefined)
                    : setSelectedCategory(highlight);
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
                    src={
                      window.location.origin +
                      "/categories/" +
                      highlight +
                      ".png"
                    }
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
                <span className="second-header">{highlight}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="subcategories mt-3">
        {availableSubCategories.map((subCategory) => {
          return <div
          className={
            subCategory == selectedSubCategory
              ? "selected sub-category second-grey"
              : "sub-category second-grey"
          }
          onClick={() => {selectedSubCategory == subCategory ? setSelectedSubCategory(undefined) : setSelectedSubCategory(subCategory)}}
          >{subCategory}</div>;
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
