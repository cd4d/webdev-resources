import React from "react";
import "./main.css";
//import Lorem from "./tests/lorem"
import getTopicData, { displayLinks } from "../../utils/utils";
import "./NavigationPath"
import NavigationPath from "./NavigationPath";
export let displayedData = {
  topic: "web resources",
  title: "Web resources",
  links: [
    {
      title:
        "Web Development - Online Courses, Classes, Training, Tutorials on Lynda",
      url:
        "https://www.lynda.com/Web-Development-training-tutorials/1471-0.html",
    },
    {
      title: "webdev: reddit for web developers",
      url: "https://www.reddit.com/r/webdev/",
    },
    {
      title:
        "How I became a web developer in under 7 months – and how you can too",
      url:
        "https://www.freecodecamp.org/news/how-i-became-a-web-developer-in-under-7-months-and-how-you-can-too/",
    },
    {
      title: "API Marketplace - Free Public & Open Rest APIs | RapidAPI",
      url: "https://rapidapi.com/",
    },

    {
      title:
        "cdnjs - The #1 free and open source CDN built to make life easier for developers",
      url: "https://cdnjs.com/",
    },
    {
      title: "Frontend Mentor | Challenges",
      url: "https://www.frontendmentor.io/challenges",
    },
  ],
};
export default function (props) {
  // default data to be displayed
  
  // access db if route matches, to be replaced by validation in backend
  if (Object.keys(props).length !== 0 && props.match.params) {
    // query DB
    let topic = props.match.params.secondSubLvl || props.match.params.firstSubLvl || props.match.params.mainTopic;
    let queryDBResult = getTopicData(props.mockDB, topic);
    // update displayedData if result
    console.log(queryDBResult);
    if (queryDBResult !== undefined) displayedData = queryDBResult;
  }
  return (
    <div className="main content column">
      <NavigationPath mockDB={props.mockDB} topic={displayedData.topic}/>
      <h1>{displayedData.title}</h1>
      <ul className="list-group list-group-flush">
      
        {displayLinks(displayedData)}
      </ul>
    </div>
  );
}
