import React from "react";
import "./main.css";
//import Lorem from "./tests/lorem"
import webdev from "../DB/web-development.json"
import node from "../DB/node.json"
import javascript from "../DB/javascript.json"
import HTML from "../DB/html-css.json"
import { v4 as uuidv4 } from "uuid";

const displayLinks = (topic) => {
  const fileData = ''
  //console.log(topic.links);
  //return topic.links.map((link) => { return <a key={uuidv4()} href={link.url}>{link.title}</a> })
}

export default function (props) {
  let displayedData = ""
  {if (props.match) { // use params only if coming from non empty request
    const topic = props.match.params.topic
     displayedData = displayLinks(topic)
  }}

  console.log(props);
  return (
    
    <div className="main content column">
      <h1>{webdev.title}</h1>
      <p>{props.topic}</p>

    </div>
  );
}
