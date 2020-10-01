import React from "react";
import webdev from "../../DB/web-development.json";
import javascript from "../../DB/javascript.json";
import HTML from "../../DB/html-css.json";
import python from "../../DB/python.json";
import Header from "../header/Header";
import Sidebar from "../sidebar/Sidebar";
import Routes from "../../routes/routes";
import "./App.css"; // keep last for CSS order
export const mockDB = [
  { ...webdev },
  { ...javascript },
  { ...HTML },
  { ...python },
];

function App() {
  return (
    <>
      <Header mockDB={mockDB} />
      <div className="lower">
        <Sidebar mockDB={mockDB} />

        <Routes />
      </div>
    </>
  );
}

export default App;
