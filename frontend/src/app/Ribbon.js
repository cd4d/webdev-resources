import React from "react";
import {
  NavLink,
} from "react-router-dom";
import Subject from "./Subject";
import subjects from "../DB/subjects.json";
import { v4 as uuidv4 } from "uuid";
import "./ribbon.css";
export default function () {
  const topics = subjects.map((sub) => Object.keys(sub));
  return (
    <>
      <nav className="ribbon">
        <ul className="subjects-ribbon">
          {topics.map((topic) => (
            <li className="subject btn btn-outline-dark mr-3 btn-responsive" key={uuidv4()}>
              <NavLink className="nav-link" to={`/${topic}`}>
                <Subject subjectTitle={topic} />
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

    </>
  );
}
