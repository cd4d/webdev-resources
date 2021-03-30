import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";

import "./main.css";
//import Lorem from "./tests/lorem"
// import displayLinks from "../../utils/utils";
import "./NavigationPath";
import NavigationPath from "./NavigationPath";
import CreateTopic from "./CreateTopic";
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

  const topics = props.topics;

  // message to display if no user logged in, passed to components
  const noUserLoggedIn = (
    <>
      Functionality locked to prevent abuse.{" "}
      <Link to="/register">Register</Link> (fake email works) to add your own
      links.
    </>
  );
  // no topic in url (homepage), set displayed topic to first topic
  if (
    Object.keys(props.match.params).length === 0 &&
    Array.isArray(topics) &&
    topics.length !== 0
  ) {
    displayedTopic = topics[0];
    // set displayed topic to the one in URL
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

  function displayLinks(currentTopicLinks) {
    return currentTopicLinks.map((link) => (
      <li key={uuidv4()} id={link._id} className="link-line">
        <a href={link.url}>{link.description}</a>{" "}
        <DeleteLink
          editDisplayedTopic={props.editDisplayedTopic}
          displayedTopic={displayedTopic}
          currentLink={link}
          triggerUpdate={props.triggerUpdate}
          noUserLoggedIn={noUserLoggedIn}
          user={props.user}
        />
      </li>
    ));
  }

  // render logged in user content
  function renderUserLoggedIn() {
    if (props.isLoading) {
      return <>Loading...</>;
    }
    return (
      <>
        <nav>
          <CreateTopic
            createNewTopic={props.createNewTopic}
            triggerUpdate={props.triggerUpdate}
            noUserLoggedIn={noUserLoggedIn}
            user={props.user}
            flushAppError={props.flushAppError}
          />
          {topics.length !== 0 && (
            <>
              <DeleteTopic
                deleteCurrentTopic={props.deleteCurrentTopic}
                displayedTopic={displayedTopic}
                triggerUpdate={props.triggerUpdate}
                noUserLoggedIn={noUserLoggedIn}
                user={props.user}
                flushAppError={props.flushAppError}
              />
              <EditTopic
                editDisplayedTopic={props.editDisplayedTopic}
                displayedTopic={displayedTopic}
                triggerUpdate={props.triggerUpdate}
                noUserLoggedIn={noUserLoggedIn}
                user={props.user}
                flushAppError={props.flushAppError}
              />
            </>
          )}
        </nav>

        {/* Navigation breadcrumbs */}
        {displayedTopic && displayedTopic.depth > 0 && (
          <NavigationPath topics={topics} currentTopic={displayedTopic} />
        )}
        {/* Title of the topic */}
        <h1 className="topic-title">
          {displayedTopic ? displayedTopic.title : "No topics"}
        </h1>
        {/* description of the topic */}
        {displayedTopic && (
          <span className="topic-description">
            {displayedTopic.description}
          </span>
        )}

        {/* Error message  */}
        {props.error && props.error.on === "topic" && (
          <p className="error-msg">Topic already exists.</p>
        )}

        {/* add link */}
        {topics.length !== 0 && (
          <AddLinks
            editDisplayedTopic={props.editDisplayedTopic}
            displayedTopic={displayedTopic}
            triggerUpdate={props.triggerUpdate}
            error={props.error}
            noUserLoggedIn={noUserLoggedIn}
            user={props.user}
            flushAppError={props.flushAppError}
          />
        )}

        {/* All the links associated with the topic, each with delete logic */}
        {props.error && props.error.on === "link" && (
          <p className="error-msg">Link already exists in another topic.</p>
        )}
        {displayedTopic && displayedTopic.links.length !== 0 ? (
          <ul className="links-list">{displayLinks(displayedTopic.links)}</ul>
        ) : (
          <p>No links provided.</p>
        )}
      </>
    );
  }
  return (
    <div className="main content column">
      {/* {props.error && props.error.on === "register" && (
        <p className="error-msg">Registration failed.</p>
      )} */}
      {/* {props.error && props.error.on === "login" && (
        <p className="error-msg">Login failed.</p>
      )} */}
      {/* {props.user ? renderUserLoggedIn() : noUserLoggedIn} */}
      {renderUserLoggedIn()}
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
