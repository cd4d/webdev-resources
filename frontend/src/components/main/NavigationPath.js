import React from "react";
import { buildNavigationPath, displayNavigationPath } from "../../utils/utils";
import "./navigation-path.css";

export default function NavigationPath (props) {
  let navigationPath;
  // build a navigation path if DB is accessed, otherwise just display default topic
  props.mockDB
    ? (navigationPath = buildNavigationPath(props.mockDB, props.topic))
    : (navigationPath = props.topic);
  let displayedNavPath;
  // if wrong input, navigationpath returns undefined, display default topic
  navigationPath
    ? (displayedNavPath = displayNavigationPath(navigationPath))
    : (displayedNavPath = props.topic);
  return <ul className="navigation-path">{displayedNavPath}</ul>;
}
