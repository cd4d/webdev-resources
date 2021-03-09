import React from "react";
import "./main.css";
//import Lorem from "./tests/lorem"
import getTopicData, { displayLinks } from "../../utils/utils";
import "./NavigationPath";
import NavigationPath from "./NavigationPath";
import AddTopic from "./AddTopic";
import { v4 as uuidv4 } from "uuid";

export let defaultData = {
  // default data to be displayed
  slug: "web-resources",
  title: "Web resources",
  links: [
    {
      description:
        "Web Development - Online Courses, Classes, Training, Tutorials on Lynda",
      url:
        "https://www.lynda.com/Web-Development-training-tutorials/1471-0.html",
    },
    {
      description: "webdev: reddit for web developers",
      url: "https://www.reddit.com/r/webdev/",
    },
    {
      description:
        "How I became a web developer in under 7 months – and how you can too",
      url:
        "https://www.freecodecamp.org/news/how-i-became-a-web-developer-in-under-7-months-and-how-you-can-too/",
    },
    {
      description: "API Marketplace - Free Public & Open Rest APIs | RapidAPI",
      url: "https://rapidapi.com/",
    },

    {
      description:
        "cdnjs - The #1 free and open source CDN built to make life easier for developers",
      url: "https://cdnjs.com/",
    },
    {
      description: "Frontend Mentor | Challenges",
      url: "https://www.frontendmentor.io/challenges",
    },
  ],
};

export default function Main(props) {
  let currentTopic = "";
  const topics = props.topics;
  if (Object.keys(props).length !== 0 && props.match.params) {
    console.log("Setting topic:", props.match.params);
    currentTopic =
      props.match.params.secondSubLvl ||
      props.match.params.firstSubLvl ||
      props.match.params.mainTopic;
  }

  console.log("topics:", topics);
  console.log("currentTopic:", currentTopic);
  let displayedData = "";
  let currentTitle = "";
  let currentLinks = [];
  // check if data is array(many topics) or not (one topic)
  Array.isArray(topics)
    ? (displayedData = topics[0])
    : (displayedData = currentTopic);
  // if a topic is selected, displays its details
  if (topics && currentTopic) {
    for (let topic of topics) {
      if (topic.slug === currentTopic) {
        currentTitle = topic.title;
        currentLinks = topic.links;
      }
    }
  } else if (topics && topics.length > 0){
     currentTitle = topics[0].title;
     currentLinks = topics[0].links;
  }

  return (
    <div className="main content column">
      {/* Temporary buttons to test functions */}
      <AddTopic mockDB={props.mockDB} />
      {/* TODO Navigation breadcrumbs */}
      {/* <NavigationPath mockDB={props.mockDB} topic={displayedData} /> */}
      {/* Title of the topic */}
      <h1>{currentTitle}</h1>
      {/* All the links associated with the topic */}
      <ul className="list-group list-group-flush">
        {currentLinks.map((link) => {
          return (
            <li key={uuidv4()} className="list-group-item">
              <a href={link.url}>{link.description}</a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// query mockDB
// Grab requested topic at its nested level. see routes file
//let queryDBResult = getTopicData(props.mockDB, topic);

// update displayedData if result
//if (queryDBResult !== undefined) displayedData = queryDBResult;
