import _ from "lodash";
import React, { Component } from "react";
import "./App.scss";

import Catalogue from "./screens/Catalogue/Catalogue";

import Header from "./components/header/header";


const App = () =>  {

    return (
      <div className="appContainer">
        <Header></Header>
        <div className="app-content">
            <Catalogue></Catalogue>
        </div>
      </div>
    );
}

export default App;
