import React, { useState,useEffect } from "react";
import "../main/main.css";

import "./login.css";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Login(props) {
  useEffect(() => {
    props.setSidebarDisplayed(false);
  });
  const history = useHistory();

  const [inputUsername, setUsername] = useState("");
  const [inputPassword, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);

  let errorType = "";

  function handleChange(e) {
    if (e.target.id === "username") {
      setUsername(e.target.value);
    }
    if (e.target.id === "password") {
      setPassword(e.target.value);
    }
  }

  return (
    <div className="single-element-container">
      <h3 className="login-title">Login</h3>
      <form
        className="login-form"
        onSubmit={async (e) => {
          e.preventDefault();

          const response = await props.handleLogin({
            username: inputUsername,
            password: inputPassword,
          });
          if (response && response.status >= 400) {
            errorType = `Login failed.`;
            return setErrorMsg(errorType);
          }
          props.setSidebarDisplayed(true);
          history.push("/");
        }}
      >
        <label className="required">Username</label>

        <input
          className="login-input"
          label="username"
          id="username"
          placeholder="username"
          value={inputUsername}
          onChange={handleChange}
        ></input>
        <label className="required">Password</label>

        <input
          className="login-input"
          type="password"
          label="password"
          id="password"
          placeholder="password"
          value={inputPassword}
          onChange={handleChange}
        ></input>
        <Link to="/reset-password">Forgot password</Link>
        <br />
        <button id="btn-login" type="submit">
          Login
        </button>
      </form>
      {errorMsg && <p className="error-msg">{errorMsg}</p>}
    </div>
  );
}
