import React, { useState, useEffect } from "react";
import mockDB from "../../DB/mockDB.json";
import Header from "../header/Header";
import Sidebar from "../sidebar/Sidebar";
import Routes from "../../routes/routes";
import { fetchUserTopics } from "../../api/api-calls";

import "./App.css"; // keep last for CSS order
// export const mockDB = [
//   { ...webdev },
//   { ...javascript },
//   { ...HTML },
//   { ...python },
// ];



function App() {
  // get list of topics
const [data, setData] = useState([]);
useEffect(() => {
  const fetchData = async () => {
    const response = await fetchUserTopics();
    console.log("app response",response);
    setData(response);
  };
  fetchData();
}, []);

  return (
    <>
      <Header mockDB={mockDB} />
      <div className="lower">
        <Sidebar topics={data} />

        <Routes />
      </div>
    </>
  );
}

export default App;
export { mockDB };
