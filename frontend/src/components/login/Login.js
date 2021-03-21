import React, { useState } from "react";
import "./login.css";
import { useHistory } from "react-router-dom";

export default function Login(props) {
  const history = useHistory();

  const [inputUsername, setUsername] = useState("");
  const [inputPassword, setpassword] = useState("");
  function handleChange(e) {
    if (e.target.id === "username") {
      setUsername(e.target.value);
    }
    if (e.target.id === "password") {
      setpassword(e.target.value);
    }
  }

  return (
    <>
      <h3 className="login-title">Login</h3>
      <form
        className="login-form"
        onSubmit={(e) => {
          e.preventDefault();
          console.log("user:", inputUsername);
          console.log("pw:", inputPassword);

          props.handleLogin({
            username: inputUsername,
            password: inputPassword,
          });
           history.push("/");
        }}
      >
        <input
          className="login-input"
          label="username"
          id="username"
          placeholder="username"
          value={inputUsername}
          onChange={handleChange}
        ></input>
        <input
          className="login-input"
          type="password"
          label="password"
          id="password"
          placeholder="password"
          value={inputPassword}
          onChange={handleChange}
        ></input>
        <button type="submit">Login</button>
      </form>
    </>
  );
}
