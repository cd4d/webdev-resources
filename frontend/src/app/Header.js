import React from "react";
import logo from "./logo192.png";
import Ribbon from "./Ribbon";

import "./header.css";
export default function () {
  return (
    <div className="header-container ">
      <div>
        <img className="logo" src={logo} alt="logo" />
      </div>
      <Ribbon />
      <hr />
    </div>
  );
}
