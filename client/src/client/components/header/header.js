import React, { useState, useEffect } from "react";
import { Image, Col, Row, Container, DropdownButton, Dropdown } from "react-bootstrap";
import "./header.scss";
import { useHistory } from "react-router-dom";
import logo from "../../../assets/logo/instalogue_logo.png";
// import reactGA from "react-ga";

const Header = (props) => {
  const history = useHistory();
  useEffect(() => {
   
  }, []);

  return (
    <div className="page-header d-flex">
    <div className="profile-image-name">
      <div  onClick={() => { history.push("/") }}>
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
        Instagram has numerous pages that act as stores with large collections of amazing products. Instalogue brings them all together, to make it easier for you to discover these pages and products. Tap the highlights to filter or search acorss stores or products. Enjoy shopping!
        </span>
        {/* While providing discoverability for online stores, instalogue aims at providing an online shopping mall experience. */}
      </div>
    </div>
  </div>
  );
};

export default Header;
