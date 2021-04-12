import React from "react";
import "./main.css"
import "./pagenotfound.css";
//https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/Redirect.md#to-object
export default function PageNotFound(props) {
  let pageNotFoundMessage = "This page doesn't exist.";
  if (
    props.location.state &&
    props.location.state.origin &&
    props.location.state.origin === "topic"
  ) {
    pageNotFoundMessage = "Topic not found.";
  }
  props.setSidebarDisplayed(false);
  return (
    <div className="single-element-container">
      <h1 id="page-not-found-title">404</h1>
      <h2 id="page-not-found-message">{pageNotFoundMessage}</h2>
    </div>
  );
}
