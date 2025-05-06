import _ from "lodash";
import React, { Component } from "react";
import "./App.scss";

import Catalogue from "./screens/Catalogue/Catalogue";
import Add from "./screens/Add/Add";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  withRouter,
  useLocation,
} from "react-router-dom";
import Header from "./components/header/header";

const App = () => {
  return (
    <Router>
      <div className="appContainer">
        <Header></Header>
        <div className="app-content">
          <Switch>
            <Route path="/home" render={(props) => <Catalogue />} />
            <Route path="/adminPanel" render={(props) => <Add />} />
            <Route path="/" render={(props) => <Catalogue />} />
            <Route/>
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default withRouter(App);
