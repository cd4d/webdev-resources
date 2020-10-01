import React from "react";
import {
  NavLink,
} from "react-router-dom";

import { v4 as uuidv4 } from "uuid";
import Subject from "./Subject"
import "./ribbon.css";
export default function (props) {
  const topics = props.mockDB.map((sub) => sub.topic);
  return (
    <>
      <nav className="ribbon">
        <ul className="subjects-ribbon">
          {topics.map((topic) => (
            <li className="subject btn btn-outline-dark mr-3 btn-responsive" key={uuidv4()}>
              <NavLink className="nav-link" to={`/${topic}`}>
                <Subject topicTitle={topic} />
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

    </>
  );
}
