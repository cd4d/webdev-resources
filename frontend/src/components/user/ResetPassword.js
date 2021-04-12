import React, { useState, useEffect } from "react";
import "../main/main.css";
import "./login.css";

export default function ResetPassword(props) {
  const [inputEmail, setEmail] = useState("");
  const [generatedLink, setGeneratedLink] = useState(null);
  const [error, setError] = useState(null);
  function handleChange(e) {
    setEmail(e.target.value);
  }
  useEffect(() => {
    setError(null);
    setGeneratedLink(null);
  }, [inputEmail]);

  return (
    <div className="single-element-container">
      <h3 className="login-title">Reset password</h3>
      <form
        className="login-form"
        onSubmit={async (e) => {
          e.preventDefault();
          const response = await props.resetPassword({
            email: inputEmail,
          });
          console.log(response);
          if (response.resetLink) {
            setGeneratedLink(response.resetLink);
          }
          if (response.status && response.status === 404) {
            setError(response.statusText);
          }
        }}
      >
        <input
          className="login-input"
          label="email"
          id="email"
          placeholder="email"
          value={inputEmail}
          onChange={handleChange}
        ></input>

        <br />
        <button type="submit">Reset password</button>
      </form>
      <div>
        {generatedLink && (
          <p>
            In a real world application, a dedicated email service would send a
            reset password. This generated link would be working:{" "}
            {generatedLink}
          </p>
        )}
        {error && <p>Email was not found.</p>}
      </div>
    </div>
  );
}
