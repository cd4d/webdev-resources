import React, { useState, useEffect } from "react";
import mockDB from "../../DB/mockDB.json";
import Header from "../header/Header";
import Sidebar from "../sidebar/Sidebar";
import Routes from "../../routes/routes";
import { fetchUserTopics, fetchUser, loginUser } from "../../api/api-calls";

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
  // get current user
  const [user, setUser] = useState(null);

  // change user when logged in
  async function handleLogin(userCredentials) {
    const response = await loginUser(userCredentials);
    console.log("logged user", response.loggedUser);
    setUser(response.loggedUser);
    // if (user) {
    //   const userData = await fetchUserTopics();
    //   setData(userData);
    // }

    // console.log("user:", user, " data:", data);
  }

  // get the current user's topics  when user changes
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchUserTopics();
      console.log("app response", response);
      setData(response);
    };

    fetchData();
  }, [user]);

  return (
    <>
      <Header
        mockDB={mockDB}
        handleLogin={(userCredentials) => handleLogin(userCredentials)}
        user={user ? user : "no user"}
      />
      <div className="lower">
        <Sidebar topics={data} />

        <Routes topics={data} user={user} />
      </div>
    </>
  );
}

export default App;
export { mockDB };
