import React from "react";
import "./main.css";
import Lorem from "./tests/lorem"
import webDevData from "../DB/web-development.json"
import nodeData from "../DB/node.json"

export default function () {
  return (
    <div className="main content column">
      <h1>{webDevData.title}</h1>
      {webDevData.links.map(link => { return (<p><a href={link.url}>{link.title}</a></p>) })}
    </div>
  );
}
