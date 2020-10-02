import React from "react";
import logo from "../../static/logo192.png";
import Ribbon from "./Ribbon";
import { Link } from "react-router-dom";

import "./header.css";
export default function (props) {
  return (
    <div className="header-container top">
      <label htmlFor="mobile-menu-checkbox">Menu</label>
      <Link to="/">
        <img className="logo" src={logo} alt="logo" />
      </Link>
      <Ribbon mockDB={props.mockDB} />
    </div>
  );
}
