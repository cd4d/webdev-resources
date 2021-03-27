import React, { useState } from "react";
import logo from "../../static/logo192.png";
import Ribbon from "./Ribbon";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import "./header.css";
export default function Header(props) {
  return (
    <div className="header-container top">
      {/* only display mobile menu if there are topics */}
      {props.topics && props.topics.length !== 0 ? (
        <label htmlFor="mobile-menu-checkbox">Menu</label>
      ) : (
        ""
      )}

      <Link to="/" key={uuidv4()}>
        <img className="logo" src={logo} alt="logo" />
      </Link>
      <div className="user-container">
        {props.user ? (
          <>
            Welcome, <span className="username-header">{props.user}</span>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                props.handleLogout();
              }}
            >
              <button type="submit">logout</button>
            </form>
          </>
        ) : (
          <>
            <p>
              <em>No user logged in.</em>
            </p>
            <Link to="/login">Login</Link> /{" "}
            <Link to="/register">Register</Link>
          </>
        )}
        {/* <form
          onSubmit={(e) => {
            e.preventDefault();
            props.handleLogin({ username: "someuser", password: "123456" });
          }}
        >
          <button type="submit">login w. topics</button>
        </form>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            props.handleLogin({ username: "test", password: "12345" });
          }}
        >
          <button type="submit">login no topics</button>
        </form> */}
      </div>
    </div>
  );
}
