import _ from "lodash";
import { Row, Col, Container, Image } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import logo from "../../../assets/logo/instalogue_logo.png";
import "./Catalogue.scss";
import CatalogueInterface from "../../interface/CatalogueInterface";
import Post from ".././../components/Post/Post";
import { Skeleton } from "@mui/material";

function Catalogue(props) {
  const [searchString, setSearchString] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(undefined);
  const [selectedSubCategory, setSelectedSubCategory] = useState(undefined);


  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableSubCategories, setAvailableSubCategories] = useState([]);


  const [isLoading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isLoadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    setSelectedSubCategory(undefined)
    loadSubCategories(selectedCategory)
  }, [selectedCategory]);

  useEffect(() => {
    reloadStores();
  }, [selectedCategory, selectedSubCategory, searchString]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    setLoadingCategories(true);
    CatalogueInterface.getCategories().then((categories) => {
      let categoryList = _.get(categories, "data.data");
      setAvailableCategories(categoryList);
      setLoadingCategories(false);
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
          <div className="pageDesc second-grey mt-1">Catalogue for Instagram stores</div>
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
              Instagram is home for numerous pages as stores with wonderful
              and vivid collection of products. Instalogue gathers them and provide better discoverability of these pages and products.
              Tap on highlights to filter. Happy shopping.
            </span>
            {/* While providing discoverability for online stores, instalogue aims at providing an online shopping mall experience. */}
          </div>
        </div>
      </div>
      <div className="highlight-filters mt-5">
        {isLoadingCategories ? (
          Array(10).fill(0).map((_, index) => (
            <div key={index}>
              <div className="highlight">
                <div className="highlight-container cursor-pointer">
                  <Skeleton variant="circular" width={80} height={80} />
                </div>
              </div>
              <div className="highlight-key mt-1">
                <Skeleton variant="text" width={100} height={20} />
              </div>
            </div>
          ))
        ) : (
          availableCategories.map((highlight) => {
            return (
              <div key={highlight}>
                <div
                  className={`highlight ${highlight === selectedCategory ? "selected" : ""}`}
                  onClick={() => {
                    selectedCategory === highlight
                      ? setSelectedCategory(undefined)
                      : setSelectedCategory(highlight);
                  }}
                >
                  <div
                    className={
                      highlight === selectedCategory
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
                      title={highlight}
                    ></Image>
                  </div>
                </div>
                <div
                  className={
                    highlight === selectedCategory
                      ? "selected highlight-key mt-1"
                      : "highlight-key mt-1"
                  }
                >
                  <span className="second-header">{highlight}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
      {availableSubCategories.length > 0 && <div className="subcategories mt-3">
        {availableSubCategories.map((subCategory) => {
          // Generate random background color
          const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
          
          // Calculate contrasting text color based on background brightness
          const r = parseInt(randomColor.slice(1,3), 16);
          const g = parseInt(randomColor.slice(3,5), 16);
          const b = parseInt(randomColor.slice(5,7), 16);
          const brightness = (r * 299 + g * 587 + b * 114) / 1000;
          const textColor = brightness > 128 ? '#000000' : '#FFFFFF';

          return <div
          // style={{backgroundColor: randomColor, color: textColor}}
          className={
            subCategory == selectedSubCategory
              ? "selected sub-category second-grey"
              : "sub-category second-grey"
          }
          onClick={() => {selectedSubCategory == subCategory ? setSelectedSubCategory(undefined) : setSelectedSubCategory(subCategory)}}
          >{subCategory}</div>;
        })}
      </div>}
      <div className="search-container mt-3 mb-3">
        <div className="search-bar">
          <i className="fa fa-search search-icon"></i>
          <div style={{position: 'relative', width: '100%'}}>
            <input
              type="text"
              className="search-input"
              placeholder="Search across products, categories, stores etc"
              value={searchString}
              onChange={(e) => {
                setSearchString(e.target.value);
              }}
              style={{ 
                fontSize: '16px',
                paddingLeft: '30px', // Make room for the icon
                backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23999\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Ccircle cx=\'11\' cy=\'11\' r=\'8\'%3E%3C/circle%3E%3Cline x1=\'21\' y1=\'21\' x2=\'16.65\' y2=\'16.65\'%3E%3C/line%3E%3C/svg%3E")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: '8px center',
                backgroundSize: '16px'
              }}
            />
            {searchString && (
              <button
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  setSearchString('');
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="posts-container">
        
      </div>
      <div className="posts mt-1">
        <div className={isLoading ? "loader active" : "loader" }></div>
        <Row>
          {isLoading ? (
            // Show 9 skeleton loaders while loading
            Array(9).fill(0).map((_, index) => (
              <Col key={index} md="4" sm="4" lg="4" xs="4" className="p-2">
                <Skeleton variant="rectangular" height={200} />
              </Col>
            ))
          ) : (
            posts.map((post) => {
              return (
                <Col md="4" sm="4" lg="4" xs="4" className="p-2">
                  <Post postinfo={post}></Post>
                </Col>
              );
            })
          )}
        </Row>
      </div>
    </Container>
  );
}

export default Catalogue;
