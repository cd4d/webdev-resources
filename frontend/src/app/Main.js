import React from "react";
import "./main.css";
//import Lorem from "./tests/lorem"
import getTopicData, { displayLinks } from "./utils";

export default function (props) {
  
  // default data to be displayed
  let displayedData = {
    topic: "web resources",
    title: "Web resources",
    links: [
      {
        title: "JavaScript: Understanding the Weird Parts | Udemy",
        url:
          "https://www.udemy.com/course/understand-javascript/?couponCode=6118495DE2F1408C71A1",
      },
      {
        title: "Eloquent JavaScript",
        url: "http://eloquentjavascript.net/",
      },
      {
        title: "Flavio Copes",
        url: "https://flaviocopes.com",
      },
      {
        title:
          "JavaScript 30 — Build 30 things with vanilla JS in 30 days with 30 tutorials",
        url: "https://javascript30.com/",
      },
      {
        title: "The Modern JavaScript Tutorial",
        url: "https://javascript.info/",
      },
    ],
  };
  // access db if route matches 
  if (Object.keys(props).length != 0 && props.match.params) {
    // query DB
    let queryDBResult = getTopicData(props.mockDB, props.match.params.topic);
    // update displayedData if result
    if (queryDBResult != undefined) displayedData = queryDBResult;
  }

  return (
    <div className="main content column">
      <h1>{displayedData.title}</h1>
      <ul className="list-group list-group-flush">
        {displayLinks(displayedData)}
      </ul>
    </div>
  );
}
