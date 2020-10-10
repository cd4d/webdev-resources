import React from "react";
import logo from "../../static/logo192.png";
import Ribbon from "./Ribbon";
import { Link as a } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import "./header.css";
export default function (props) {
  return (
    <div className="header-container top">
      <label htmlFor="mobile-menu-checkbox">Menu</label>
      <a href="/" key={uuidv4()}>
        <img className="logo" src={logo} alt="logo" />
      </a>
      <Ribbon mockDB={props.mockDB} />
    </div>
  );
}
