import React from "react";
import "./loading-spinner.css";

export default function Loading() {
  return (
    <>
      <p className="loading-text">Loading...</p>
      <div className="loading-spinner" role="alert" aria-live="assertive"></div>
    </>
  );
}
