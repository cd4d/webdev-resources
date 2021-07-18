import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import "../main/modal.css";
import "../main/main.css";
import "./about.css";
// import backendFile from "./backend.md";
// import frontendFile from "./frontend.md";
import aboutFile from "./about.md";
export default function About(props) {
  // const [backend, setBackend] = useState(null);
  // const [frontend, setFrontend] = useState(null);
  const [about, setAbout] = useState(null);

  useEffect(() => {
    props.setSidebarDisplayed(false);
    // load markdown files
    // https://stackoverflow.com/a/53975297
    // fetch(backendFile)
    //   .then((response) => response.text())
    //   .then((text) => setBackend(text));
    // fetch(frontendFile)
    //   .then((response) => response.text())
    //   .then((text) => setFrontend(text));
    fetch(aboutFile)
      .then((response) => response.text())
      .then((text) => setAbout(text));
  });

  /*<div className="about-container">
        <div className="about-table">

          <ReactMarkdown children={backend} />
        </div>
        <div className="about-table">
          <ReactMarkdown children={frontend} />
        </div> 
      </div>*/

  const aboutSection = (
    <div className="about-container-one-column">
      <div className="about-text">
        <h2 className="about-title">About</h2>
        <ReactMarkdown children={about} />
      </div>
    </div>
  );

  return <>{aboutSection}</>;
}
