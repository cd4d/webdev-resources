import React from "react";

import Header from "./Header";
import Sidebar from "./Sidebar";
import Main from "./Main";
import "./App.css"; // keep last for CSS order
function App() {
  return (
    <>
      <Header />
      <div className="lower">
        <Sidebar />
        <Main />
      </div>
    </>
  );
}

export default App;
