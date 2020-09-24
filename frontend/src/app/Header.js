import React from "react";
import logo from "./logo192.png";
import Ribbon from "./Ribbon";

import "./header.css";
export default function () {
  return (
    <div className="header-container top">

        <img className="logo" src={logo} alt="logo" />
 
      <Ribbon />
      <hr />
    </div>
  );
}
