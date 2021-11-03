import _ from "lodash";
import { Row, Form, Container, Button } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import logo from "../../../assets/logo/logo.jpg";
import "./Add.scss";
import CatalogueInterface from "../../interface/CatalogueInterface";
import Post from ".././../components/Post/Post";

function Add(props) {
  const [form, setFormData] = useState({
    category: "",
    subCategory: "",
    postURL: "",
    postURL: "",
    storeName: "",
  });

  const handleChange = (event) => {
    let returnObj = {};
    returnObj[event.target.name] = event.target.value;
    setFormData({ ...form, ...returnObj });
  };

  const addStore = () => {
    CatalogueInterface.addStore(form)
      .then((success) => {
        alert("posted");
      })
      .catch((err) => {
        alert("failed");
      });
  };
  return (
    <Container className="add-form">
      <h1 className="text-center father-grey">Admin Panel </h1>
      <Form.Control
        placeholder="Category"
        value={form.category}
        name="category"
        onChange={handleChange}
      />
      <Form.Control
        placeholder="subCategory"
        value={form.subCategory}
        name="subCategory"
        onChange={handleChange}
      />
      <Form.Control
        placeholder="thumbnailURL"
        value={form.thumbnailURL}
        name="thumbnailURL"
        onChange={handleChange}
      />
      <Form.Control
        placeholder="postURL"
        value={form.postURL}
        name="postURL"
        onChange={handleChange}
      />
      <Form.Control
        placeholder="storeName"
        value={form.storeName}
        name="storeName"
        onChange={handleChange}
      />
      <Button
        onClick={() => {
          addStore();
        }}
      >
        Add store
      </Button>
    </Container>
  );
}

export default Add;
