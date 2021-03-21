import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import "./main.css";
//import Lorem from "./tests/lorem"
// import displayLinks from "../../utils/utils";
import "./NavigationPath";
import NavigationPath from "./NavigationPath";
import AddTopic from "./AddTopic";
import DeleteTopic from "./DeleteTopic";
import EditTopic from "./EditTopic";
import AddLinks from "./AddLinks";
import DeleteLink from "./DeleteLink";

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
  // default blank data
  let displayedTopic = { title: "", slug: "", links: [], _id: "" };
  const [errorMsg, setErrorMsg] = useState(null);
  const topics = props.topics;

  // no topic in url (homepage), set displayed topic to first topic
  if (
    Object.keys(props.match.params).length === 0 &&
    Array.isArray(topics) &&
    topics.length !== 0
  ) {
    displayedTopic = topics[0];
    // set displayed topic to one in URL
  } else if (Object.keys(props.match.params).length !== 0) {
    displayedTopic.slug =
      props.match.params.firstSubLvl || props.match.params.mainTopic;
  }

  // if a topic is selected, displays its details
  if (topics && displayedTopic) {
    for (let topic of topics) {
      if (topic.slug === displayedTopic.slug) {
        displayedTopic = topic;
      }
    }
  } else if (topics && topics.length > 0) {
    displayedTopic = topics[0];
  }

  function flushError() {
    setErrorMsg(null);
  }

  function displayLinks(currentTopicLinks) {
    return currentTopicLinks.map((link) => (
      <li key={uuidv4()} id={link._id} className="list-group-item">
        <a href={link.url}>{link.description}</a>{" "}
        <DeleteLink
          editDisplayedTopic={props.editDisplayedTopic}
          displayedTopic={displayedTopic}
          currentLink={link}
          triggerUpdate={props.triggerUpdate}
          flushError={flushError}
        />
      </li>
    ));
  }

  useEffect(() => {
    props.error && setErrorMsg(props.error);
  }, [props.error]);

  const noUserLoggedIn = <>Login or register to build your lists of links.</>;

  // render logged in user content
  function renderUserLoggedIn() {
    if (props.isLoading) {
      return <>Loading...</>;
    }
    return (
      <>
        <AddTopic
          addNewTopic={props.addNewTopic}
          triggerUpdate={props.triggerUpdate}
          flushError={flushError}
        />
        {topics.length !== 0 && (
          <>
            <DeleteTopic
              deleteCurrentTopic={props.deleteCurrentTopic}
              displayedTopic={displayedTopic}
              triggerUpdate={props.triggerUpdate}
              flushError={flushError}
            />
            <EditTopic
              editDisplayedTopic={props.editDisplayedTopic}
              displayedTopic={displayedTopic}
              triggerUpdate={props.triggerUpdate}
              flushError={flushError}
            />
          </>
        )}

        {/* Navigation breadcrumbs */}
        {displayedTopic && (
          <NavigationPath topics={topics} currentTopic={displayedTopic} />
        )}
        {/* Title of the topic */}
        <h1>{displayedTopic ? displayedTopic.title : "No topics"}</h1>

        {/* Error message  */}
        {errorMsg && <p className="error-msg">{errorMsg.statusText}</p>}

        {/* add link */}
        <AddLinks
          editDisplayedTopic={props.editDisplayedTopic}
          displayedTopic={displayedTopic}
          triggerUpdate={props.triggerUpdate}
          error={props.error}
          flushError={flushError}
        />

        {/* All the links associated with the topic, each with delete logic */}
        <ul className="list-group list-group-flush">
          {displayedTopic && displayedTopic.links.length !== 0 ? (
            displayLinks(displayedTopic.links)
          ) : (
            <p>No links provided.</p>
          )}
        </ul>
      </>
    );
  }
  return (
    <div className="main content column">
      {props.user ? renderUserLoggedIn() : noUserLoggedIn}
    </div>
  );
}

// OLD
// let displayedData = "";

// // check if data is array(many topics) or not (one topic)
// Array.isArray(topics)
//   ? (displayedData = topics[0])
//   : (displayedData = currentTopic);
// query mockDB
// Grab requested topic at its nested level. see routes file
//let queryDBResult = getTopicData(props.mockDB, topic);

// update displayedData if result
//if (queryDBResult !== undefined) displayedData = queryDBResult;
