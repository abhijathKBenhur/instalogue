import React,{useState,useEffect} from "react";
import "./post.scss";
import _ from "lodash";

import { Row, Col, Container, Image } from "react-bootstrap";
const Post = (props) => {


  return (
    <div className="post-container">
      {props.postinfo && <Image
        className="post"
        src={props.postinfo.thumbnailURL}
        onClick={() => {
          window.open(props.postinfo.postURL);
        }}
      ></Image>}
    </div>
  );
};

export default Post;
