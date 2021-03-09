import React, { useState, useEffect } from "react";
import mockDB from "../../DB/mockDB.json";
import Header from "../header/Header";
import Sidebar from "../sidebar/Sidebar";
import Routes from "../../routes/routes";
import { useHistory } from "react-router-dom";

import {
  fetchUserTopics,
  fetchCurrentUser,
  loginUser,
  logoutUser,
} from "../../api/api-calls";

import "./App.css"; // keep last for CSS order
// export const mockDB = [
//   { ...webdev },
//   { ...javascript },
//   { ...HTML },
//   { ...python },
// ];

function App() {
  // list of topics
  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);
  // useHistory from react-router for redirection
  const history = useHistory();

  //  login and setting current user
  async function handleLogin(userCredentials) {
    const response = await loginUser(userCredentials);
    console.log("response is:", response);
    if (response) {
      setUser(response.loggedUser);
    }
  }

  // logout user
  async function handleLogout() {
    const response = await logoutUser();
    if (response) {
      setData([]);
      setUser(null);
      history.push("/");
    }
  }
  // get current user at start
  useEffect(() => {
    const getCurrentUser = async () => {
      const response = await fetchCurrentUser();
      console.log("current user", response);
      if (response.currentUser) {
        setUser(response.currentUser.username);
      }
    };
    getCurrentUser();
  }, [user]);

  // get the current user's topics  when user changes
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchUserTopics();
      console.log("app response", response);
      setData(response);
    };
    if (user) {
      fetchData();
    }
  }, [user]);

  return (
    <>
      <Header
        mockDB={mockDB}
        handleLogin={(userCredentials) => handleLogin(userCredentials)}
        handleLogout={handleLogout}
        user={user ? user : "no user"}
      />
      <div className="lower">
        {user && <Sidebar topics={data} user={user} />}

        <Routes
          topics={user && data}
          handleLogin={(userCredentials) => handleLogin(userCredentials)}
          handleLogout={handleLogout}
        />
      </div>
    </>
  );
}

export default App;
export { mockDB };
