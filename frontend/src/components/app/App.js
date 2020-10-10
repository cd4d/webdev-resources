import React from "react";
import mockDB from "../../DB/mockDB.json"
import Header from "../header/Header";
import Sidebar from "../sidebar/Sidebar";
import Routes from "../../routes/routes";
import "./App.css"; // keep last for CSS order
// export const mockDB = [
//   { ...webdev },
//   { ...javascript },
//   { ...HTML },
//   { ...python },
// ];

function App() {
  return (
    <>
      <Header mockDB={mockDB} />
      <div className="lower">
        <Sidebar mockDB={mockDB} />

        <Routes />
      </div>
    </>
  );
}

export default App;
export {mockDB}