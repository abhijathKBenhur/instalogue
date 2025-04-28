import _ from "lodash";
import { Row, Form, Container, Button } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import "./Add.scss";
import CatalogueInterface from "../../interface/CatalogueInterface";
import Post from ".././../components/Post/Post";

function Add(props) {
  const [form, setFormData] = useState({
    category: "",
    subCategory: "",
    postURL: "",
    thumbnailURL: "",
    storeName: "",
    password: "",
    keywords: "",
    fullData: "",
    fullSheet: "",
  });

  const handleChange = (event) => {
    let returnObj = {};
    returnObj[event.target.name] = event.target.value;
    setFormData({ ...form, ...returnObj });
  };

  const addStore = () => {
    CatalogueInterface.addStore(form)
      .then((success) => {
        console.log("posted");
      })
      .catch((err) => {
        console.log("failed");
      });
  };

  const setFullData = () => {
    let payload = {
      category: form.fullData.split("\t")[1],
      subCategory: form.fullData.split("\t")[2],
      postURL: form.fullData.split("\t")[4],
      thumbnailURL: form.fullData.split("\t")[3],
      storeName: form.fullData.split("\t")[0],
      password: "itsmeaddy",
      keywords: form.fullData.split("\t")[5],
    };
    CatalogueInterface.addStore(payload)
      .then((success) => {
        alert("posted");
      })
      .catch((err) => {
        console.log(err)
        alert("failed");
      });
  };

  const setFullSheet = () => {
    console.log(form.fullSheet)
    const sheet = form.fullSheet.split("###")
    console.log(sheet)
    for(let i=0 ; i<sheet.length; i++){
      let fullData = sheet[i].trim();
      let payload = {
        category: fullData.split("\t")[1],
        subCategory: fullData.split("\t")[2],
        postURL: fullData.split("\t")[4],
        thumbnailURL: fullData.split("\t")[3],
        storeName: fullData.split("\t")[0],
        password: "itsmeaddy",
        keywords: fullData.split("\t")[5],
      };

      console.log(payload)
      CatalogueInterface.addStore(payload)
        .then((success) => {
          console.log("posted");
        })
        .catch((err) => {
          console.log("failed");
        });
    }
    
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
      <Form.Control
        placeholder="keywords"
        value={form.keywords}
        name="keywords"
        onChange={handleChange}
      />
      <Form.Control
        placeholder="password"
        value={form.password}
        name="password"
        onChange={handleChange}
      />
      <Button
        onClick={() => {
          addStore();
        }}
        id="submitButton"
      >
        Add store
      </Button>
      <br />
      <br />
      <br />
      <h1>Excel Row </h1>
      <Form.Control
        placeholder="Full data"
        value={form.fullData}
        name="fullData"
        onChange={handleChange}
      />
      <Button
        onClick={() => {
          setFullData();
        }}
        id="setFullDataButton"
      >
        Add full Data
      </Button>
      <br />
      <br />
      <h1>Excel Sheet </h1>
      <Form.Control
        placeholder="Full Sheet"
        value={form.fullSheet}
        name="fullSheet"
        onChange={handleChange}
      />
      <Button
        onClick={() => {
          setFullSheet();
        }}
        id="setFullSheetButton"
      >
        Add full Sheet
      </Button>
    </Container>
  );
}

export default Add;
