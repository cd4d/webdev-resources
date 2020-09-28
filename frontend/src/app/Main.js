import React from "react";
import "./main.css";
//import Lorem from "./tests/lorem"
import { v4 as uuidv4 } from "uuid";

// returns the whole data for each topic from mockDB in App
const getTopicData = (dataBase,topicToFind) => {
  const topicFound = dataBase.find(x => x.topic === topicToFind);
 return topicFound
};
const displayLinks= (topic) =>{
  return topic.links.map((link) => { return <li key={uuidv4()} className="list-group-item"><a  href={link.url}>{link.title}</a></li> })
}
export default function (props) {
  let topicInDB=""
  if(props.match) { topicInDB = getTopicData(props.mockDB,props.match.params.topic)}
  const defaultData = {topic: "web resources",
  title: "Web resources",
  links: [
      {
          "title": "JavaScript: Understanding the Weird Parts | Udemy",
          "url": "https://www.udemy.com/course/understand-javascript/?couponCode=6118495DE2F1408C71A1"
      },
      {
          "title": "Eloquent JavaScript",
          "url": "http://eloquentjavascript.net/"
      },
      {
          "title": "Flavio Copes",
          "url": "https://flaviocopes.com"
      },
      {
          "title": "JavaScript 30 — Build 30 things with vanilla JS in 30 days with 30 tutorials",
          "url": "https://javascript30.com/"
      },
      {
          "title": "The Modern JavaScript Tutorial",
          "url": "https://javascript.info/"
      }
  ]}
  const displayedData = topicInDB ? topicInDB : defaultData
  
    return (

      <div className="main content column">
        <h1>{displayedData.title}</h1>
  <ul className="list-group list-group-flush">{displayLinks(displayedData)}</ul>
      </div>
    );
  
    
}
