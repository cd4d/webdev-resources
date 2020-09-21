import React from "react";
import Sidebar from "./Sidebar";
import Main from "./Main";
import "./content.css";

export default function () {
  return (
    <div className="content">
      <Sidebar />
      <Main />
    </div>
  );
}
