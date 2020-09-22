import React from "react";
import Subject from "./Subject";
import subjects from "../DB/subjects.json";
import { v4 as uuidv4 } from 'uuid';
import "./ribbon.css"
export default function () {
    const titles = subjects.map(sub => Object.keys(sub))
  return (
      
    <nav className="ribbon">
      <ul className="subjects-ribbon">
        {titles.map((title) => (
          <li className="subject btn btn-outline-dark mr-3" key={uuidv4()}>
            <Subject  subjectTitle={title}/>
          </li>
        ))}
      </ul>
    </nav>
  );
}
