import React, { useState } from "react";
import "./register.css";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Login(props) {
  const history = useHistory();

  const [inputUsername, setUsername] = useState("");
  const [inputEmail, setEmail] = useState("");

  const [inputPassword, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  let errorType = "";
  function handleChange(e) {
    if (e.target.id === "username") {
      setUsername(e.target.value);
    }
    if (e.target.id === "email") {
      setEmail(e.target.value);
    }
    if (e.target.id === "password") {
      setPassword(e.target.value);
    }
    if (e.target.id === "confirm-password") {
      setConfirmPassword(e.target.value);
    }
  }

  return (
    <div className="container-center">
      <h3 className="register-title">Register</h3>
      <form
        className="register-form"
        onSubmit={async (e) => {
          e.preventDefault();
          console.log("user:", inputUsername);
          console.log("pw:", inputPassword);
          if (inputPassword !== confirmPassword) {
            return setErrorMsg("Password and confirmation do not match.");
          }
          // Register the user
          const response = await props.handleRegister({
            username: inputUsername,
            email: inputEmail,
            password: inputPassword,
            confirmPassword: confirmPassword,
          });
          // Successfully registered, login the user
          if (response) {
            console.log("register response: ", response);
            if (response.status === 200) {
              const loggedUser = props.handleLogin({
                username: inputUsername,
                password: inputPassword,
              });
            }
            // Error in registration, display message
            if (response.status >= 400) {
              // invalid password/username
              if (
                response.data.errors &&
                Array.isArray(response.data.errors) &&
                response.data.errors[0].param
              ) {
                errorType =
                  "Could not register: invalid " +
                  response.data.errors[0].param;
              }
              // email/username already exists
              if (typeof response.data === "object" && response.data !== null) {
                errorType = response.data.message;
              }
              return setErrorMsg(errorType);
            }
          }
        }}
      >
        <label className="required">Username</label>
        <input
          className="register-input"
          label="username"
          id="username"
          placeholder="username"
          value={inputUsername}
          onChange={handleChange}
          required
        ></input>
        <label className="required">Email</label>
        <input
          className="register-input"
          type="email"
          label="email"
          id="email"
          placeholder="email"
          value={inputEmail}
          onChange={handleChange}
          required
        ></input>
        <label className="required">Password</label>{" "}
        <input
          className="register-input required"
          type="password"
          label="password"
          id="password"
          placeholder="password"
          value={inputPassword}
          onChange={handleChange}
          required
        ></input>
        <label className="required">Confirm password</label>
        <input
          className="register-input required"
          type="password"
          label="confirm-password"
          id="confirm-password"
          placeholder="confirm password"
          value={confirmPassword}
          onChange={handleChange}
          required
        ></input>
        <br />
        <button type="submit">Register</button>
      </form>
      {errorMsg && <p className="error-msg">{errorMsg}</p>}
    </div>
  );
}
