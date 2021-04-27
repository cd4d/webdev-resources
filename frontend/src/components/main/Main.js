import React from "react";

import "./main.css";

//import Lorem from "./tests/lorem"
// import displayLinks from "../../utils/utils";
import "./NavigationPath";
import CreateTopic from "./CreateTopic";
import DeleteTopic from "./DeleteTopic";
import EditTopic from "./EditTopic";
import TopicContainer from "./TopicContainer";
import Loading from "../app/Loading";

// export let defaultData = {
//   // default data to be displayed
//   slug: "web-resources",
//   title: "Web resources",
//   links: [
//     {
//       description:
//         "Web Development - Online Courses, Classes, Training, Tutorials on Lynda",
//       url:
//         "https://www.lynda.com/Web-Development-training-tutorials/1471-0.html",
//     },
//     {
//       description: "webdev: reddit for web developers",
//       url: "https://www.reddit.com/r/webdev/",
//     },
//     {
//       description:
//         "How I became a web developer in under 7 months – and how you can too",
//       url:
//         "https://www.freecodecamp.org/news/how-i-became-a-web-developer-in-under-7-months-and-how-you-can-too/",
//     },
//     {
//       description: "API Marketplace - Free Public & Open Rest APIs | RapidAPI",
//       url: "https://rapidapi.com/",
//     },

//     {
//       description:
//         "cdnjs - The #1 free and open source CDN built to make life easier for developers",
//       url: "https://cdnjs.com/",
//     },
//     {
//       description: "Frontend Mentor | Challenges",
//       url: "https://www.frontendmentor.io/challenges",
//     },
//   ],
// };

export default function Main(props) {
  
  // default blank data
  let displayedTopic = { title: "", slug: "", links: [], _id: "" };
  const topics = props.topics;

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
    let topicFound = false;

    for (let topic of topics) {
      if (topic.slug === displayedTopic.slug) {
        displayedTopic = topic;
        topicFound = true;
      }
    }
    if (!topicFound) {
      //console.log("topic not found!");
      // return (
      //   <Redirect
      //     to={{
      //       pathname: "/page-not-found",
      //       state: { origin: "topic" },
      //     }}
      //   />
      // );
    }
  } else if (topics && topics.length > 0) {
    displayedTopic = topics[0];
  }
  // render  user content
  function renderUserTopics() {
    if (props.isLoading) {
      return <Loading />;
    }
    return (
      <div className="main-container">
        <nav className="topic-buttons-container">
          <CreateTopic
            topics={props.topics}
            handleCreateTopic={props.handleCreateTopic}
            triggerUpdate={props.triggerUpdate}
            user={props.user}
            handleError={props.handleError}
            flushAppError={props.flushAppError}
          />
          {topics && topics.length !== 0 && (
            <>
              <EditTopic
                topics={props.topics}
                handleEditTopic={props.handleEditTopic}
                displayedTopic={displayedTopic}
                triggerUpdate={props.triggerUpdate}
                user={props.user}
                handleError={props.handleError}
                flushAppError={props.flushAppError}
              />
              <DeleteTopic
                deleteCurrentTopic={props.deleteCurrentTopic}
                displayedTopic={displayedTopic}
                triggerUpdate={props.triggerUpdate}
                user={props.user}
                handleError={props.handleError}
                flushAppError={props.flushAppError}
              />
            </>
          )}
        </nav>
        <TopicContainer {...props} displayedTopic={displayedTopic} />
      </div>
    );
  }
  return <div className="main content column">{renderUserTopics()}</div>;
}
// Locking guest user, not implemented
// const noUserLoggedIn = (
//   <>
//     Functionality locked to prevent abuse.{" "}
//     <Link to="/register">Register</Link> (fake email works) to add your own
//     links.
//   </>
// );
