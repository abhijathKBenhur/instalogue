import _ from "lodash";
import React, { Component } from "react";
import { Container } from "react-bootstrap";
import "./App.scss";

import Catalogue from "./screens/Catalogue/Catalogue";
import Admin from "./screens/Admin/Admin";
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
      <Container className="appContainer">
        <Header></Header>
        <div className="app-content">
          <Switch>
            <Route path="/home" render={(props) => <Catalogue />} />
            <Route path="/admin" render={(props) => <Admin />} />
            <Route path="/" render={(props) => <Catalogue />} />
            <Route/>
          </Switch>
        </div>
      </Container>
    </Router>
  );
};

export default withRouter(App);
