import _ from "lodash";
import React, { Component } from "react";
import "./App.scss";

import Gallery from "./screens/Gallery/Catalogue";

import Header from "./components/header/header";


const App = () =>  {

    return (
      <div className="appContainer">
        <Header></Header>
        <div className="app-content">
            <Gallery></Gallery>
        </div>
      </div>
    );
}

export default App;
