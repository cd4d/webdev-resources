import React from "react";
import { buildNavigationPath, displayNavigationPath } from "../../utils/utils";
import "./navigation-path.css";

export default function NavigationPath(props) {
  let navigationPath;
  // build a navigation path if many topics, otherwise just display default topic
  props.topics
    ? (navigationPath = buildNavigationPath(props.topics, props.currentTopic))
    : (navigationPath = props.currentTopic.title);
  let displayedNavPath;
  // if wrong input, navigationpath returns undefined, display default topic
  navigationPath
    ? (displayedNavPath = displayNavigationPath(navigationPath))
    : (displayedNavPath = props.currentTopic.title);
  return <ul className="navigation-path">{displayedNavPath}</ul>;
}
