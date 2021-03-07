import React, { useState } from "react";
import logo from "../../static/logo192.png";
import Ribbon from "./Ribbon";
import { Link as a } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import "./header.css";
export default function Header(props) {
  // TODO login user

  return (
    <div className="header-container top">
      <label htmlFor="mobile-menu-checkbox">Menu</label>
      <a href="/" key={uuidv4()}>
        <img className="logo" src={logo} alt="logo" />
      </a>
      <Ribbon mockDB={props.mockDB} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          props.handleLogin({
            username: "rtytrhtrh",
            password: "45277",
          });
        }}
      >
        <button type="submit">wrongLogin</button>
      </form>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          props.handleLogin({
            username: "someuser",
            password: "123456",
          });
        }}
      >
        <button type="submit">login</button>
      </form>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          props.handleLogout();
        }}
      >
        <button type="submit">logout</button>
      </form>
      User: {props.user}
    </div>
  );
}
