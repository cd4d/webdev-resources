import React, { useState, useEffect } from "react";
import NavigationPath from "./NavigationPath";
import AddLinks from "./AddLinks";
import DisplayLinks from "./DisplayLinks";
import "./topic-container.css";
export default function TopicContainer(props) {
  const { displayedTopic, topics } = props;
  const [displayedError, setDisplayedError] = useState(null);
  // display error on link/topic or flush it
  useEffect(() => {
    const displayError = function () {
      if (props.error && props.error.on) {
        if (props.error.status === 409)
          setDisplayedError(
            <p className="error-msg">
              {props.error.on} already exists in database.
            </p>
          );
        else if (props.error.message) {
          setDisplayedError(
            <p className="error-msg">{`Error adding ${props.error.on}: ${props.error.message}`}</p>
          );
        } else {
          setDisplayedError(
            <p className="error-msg">{`Error adding ${props.error.on}`}.</p>
          );
        }
      }
    };
    if (!props.error) setDisplayedError(null);
    displayError();
  }, [props.error]);
  return (
    <div className="topic-container">
      {displayedTopic && displayedTopic.depth > 0 && (
        <NavigationPath topics={topics} currentTopic={displayedTopic} />
      )}
      {/* Title of the topic */}
      <h1 className="topic-title">
        {displayedTopic ? displayedTopic.title : "No topics"}
      </h1>
      {/* description of the topic */}
      {displayedTopic && (
        <div className="topic-description">{displayedTopic.description}</div>
      )}{" "}
      {/* add link */}
      {topics && topics.length !== 0 && (
        <AddLinks
          handleCreateLink={props.handleCreateLink}
          displayedTopic={displayedTopic}
          triggerUpdate={props.triggerUpdate}
          error={props.error}
          user={props.user}
          flushAppError={props.flushAppError}
          handleError={props.handleError}
        />
      )}
      {/* Error message. */}
      {displayedError}
      {/* All the links associated with the topic, each with delete logic */}
      {displayedTopic && displayedTopic.links.length !== 0 ? (
        <>
          {
            <DisplayLinks
              editCurrentLink={props.editCurrentLink}
              handleDeleteLink={props.handleDeleteLink}
              displayedTopic={displayedTopic}
              toggleDeleteLink={props.toggleDeleteLink}
              triggerUpdate={props.triggerUpdate}
              user={props.user}
              handleError={props.handleError}
            />
          }
        </>
      ) : (
        <p>No links provided.</p>
      )}
    </div>
  );
}

//  {/* Navigation breadcrumbs */}
//  {displayedTopic && displayedTopic.depth > 0 && (
//    <NavigationPath topics={topics} currentTopic={displayedTopic} />
//  )}

//      {/* Title of the topic */}
//      <h1 className="topic-title">
//        {displayedTopic ? displayedTopic.title : "No topics"}
//      </h1>

//      {/* description of the topic */}
//      {displayedTopic && (
//        <span className="topic-description">
//          {displayedTopic.description}
//        </span>
//      )}{" "}

//  {/* add link */}
//  {topics && topics.length !== 0 && (
//    <AddLinks
//      handleCreateLink={props.handleCreateLink}
//      displayedTopic={displayedTopic}
//      triggerUpdate={props.triggerUpdate}
//      error={props.error}
//      user={props.user}
//      flushAppError={props.flushAppError}
//      handleError={props.handleError}
//    />
//  )}
//  {/* All the links associated with the topic, each with delete logic */}
//  {displayedError}
//  {displayedTopic && displayedTopic.links.length !== 0 ? (
//    <>
//      {
//        <DisplayLinks
//          editCurrentLink={props.editCurrentLink}
//          handleDeleteLink={props.handleDeleteLink}
//          displayedTopic={displayedTopic}
//          toggleDeleteLink={props.toggleDeleteLink}
//          triggerUpdate={props.triggerUpdate}
//          user={props.user}
//        />
//      }
//    </>
//  ) : (
//    <p>No links provided.</p>
//  )}
