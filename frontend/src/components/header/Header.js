import React from "react";
import logo from "../../static/logo192.png";
import Ribbon from "./Ribbon";

import "./header.css";
export default function (props) {
  return (
    <div className="header-container top">
      <label htmlFor="mobile-menu-checkbox">Menu</label>
      <a href="/"><img className="logo" src={logo} alt="logo" /></a>
      <Ribbon mockDB={props.mockDB}/>
    </div>
  );
}
