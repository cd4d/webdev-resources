import React, { useState } from "react";
import logo from "../../static/logo-webresources.png";
import Ribbon from "./Ribbon";
import { Link } from "react-router-dom";
import ResetPassword from "../user/ResetPassword";
import { v4 as uuidv4 } from "uuid";

import "./header.css";
export default function Header(props) {
  return (
    <div className="header-container top">
      {/* only display mobile menu if there are topics */}
      {props.topics && props.topics.length !== 0 ? (
        <label
          className="gg-menu"
          title="Menu"
          htmlFor="mobile-menu-checkbox"
        ></label>
      ) : (
        ""
      )}

      <Link
        to="/"
        key={uuidv4()}
        onClick={() => {
          props.flushAppError();
          props.setSidebarDisplayed(true);
        }}
      >
        {/* <img className="logo" src={logo} alt="logo" /> */}
        <h1 id="site-title">Link lists builder</h1>
      </Link>
      <Link to="/feef">404 here</Link>
      <div className="user-container">
        {props.user ? (
          <>
            Welcome, <span className="username-header">{props.user}</span>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                props.flushAppError();
                props.handleLogout();
              }}
            >
              <button type="submit">logout</button>
            </form>
            <Link to="/reset-password">Reset password</Link>
          </>
        ) : (
          <>
            <p>
              <em>No user logged in.</em>
            </p>
            <Link
              className="login-register-links"
              to="/login"
              // calling two functions: empty error msgs and hide sidebar
              onClick={() => {
                props.flushAppError();
                props.setSidebarDisplayed(false);
              }}
            >
              Login
            </Link>{" "}
            /{" "}
            <Link
              className="login-register-links"
              to="/register"
              onClick={() => {
                props.flushAppError();
                props.setSidebarDisplayed(false);
              }}
            >
              Register
            </Link>
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
