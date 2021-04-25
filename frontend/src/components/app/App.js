import React, { useState, useEffect } from "react";
import Header from "../header/Header";
import Sidebar from "../sidebar/Sidebar";
import Routes from "../../routes/routes";
import WelcomeScreen from "./WelcomeScreen";
import { useHistory } from "react-router-dom";
import guestDB from "../../DB/guestDB.json";

import {
  fetchUserTopics,
  fetchCurrentUser,
  loginUser,
  registerUser,
  logoutUser,
  createTopic,
  deleteTopic,
  editTopic,
  createLink,
  deleteLink,
  editLink,
  resetPassword,
} from "../../CRUD/api-calls";
import { createTopicGuest } from "../../CRUD/guestUser/createTopicGuest";
import { editTopicGuest } from "../../CRUD/guestUser/editTopicGuest";

import { deleteTopicGuest } from "../../CRUD/guestUser/deleteTopicGuest";
import { handleLinksGuest } from "../../CRUD/guestUser/handleLinksGuest";
// keep last for CSS order
import "./icons.css";
import "./App.css";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [checkingLogin, setCheckingLogin] = useState(true);

  const [user, setUser] = useState(null);
  const [data, setData] = useState(startingData());

  const [error, setError] = useState(null);
  const [updated, setUpdated] = useState(false);
  const [sidebarDisplayed, setSidebarDisplayed] = useState(true);
  // Starting data: default list of topics or user topics
  function startingData() {
    if (user) {
      return fetchUserTopics();
    }
    if (JSON.parse(window.localStorage.getItem("guestDB"))) {
      return JSON.parse(window.localStorage.getItem("guestDB"));
    }
    return guestDB;
  }
  // set localstorage to default data if empty
  if (!user && data && !window.localStorage.getItem("guestDB")) {
    const json = JSON.stringify(data);
    window.localStorage.setItem("guestDB", json);
  }

  // useHistory from react-router for redirection
  const history = useHistory();

  function handleError(error) {
    console.log("error called: ", error);
    setError({
      status: error.status,
      statusText: error.statusText,
      on: error.on,
      operation: error.operation,
    });
  }

  // get current user at start and stop loading state
  useEffect(() => {
    const getCurrentUser = async () => {
      const response = await fetchCurrentUser();
      if (response.currentUser) {
        setUser(response.currentUser.username);
      }
      setIsLoading(false);
      setCheckingLogin(false);
    };
    setTimeout(getCurrentUser, 1000);
    // getCurrentUser();
  }, [user]);

  // get the current user's topics when user changes or update triggered
  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response = await fetchUserTopics();
        setData(response);
      } catch (err) {
        setError(err);
      }
    };
    if (user) {
      console.log("getting new data");
      fetchData();
      setIsLoading(false);
    } else if (!checkingLogin) {
      setData(JSON.parse(window.localStorage.getItem("guestDB")));
      setIsLoading(false);
    }
  }, [user, updated, checkingLogin]);

  function triggerUpdate() {
    setError(null);

    setUpdated((prevState) => !prevState);
  }

  function flushAppError() {
    setError(null);
  }
  //  login and setting current user
  async function handleLogin(userCredentials) {
    setIsLoading(true);
    setCheckingLogin(true);
    const response = await loginUser(userCredentials);
    if (response && response.status === 200) {
      setUser(response.loggedUser);
    }

    return response;
  }

  // logout user and redirect to homepage
  async function handleLogout() {
    const response = await logoutUser();
    if (response) {
      setData(
        window.localStorage.getItem("guestDB")
          ? JSON.parse(window.localStorage.getItem("guestDB"))
          : guestDB
      );
      setUser(null);
      history.push("/");
    }
  }

  return (
    <>
      <Header
        topics={data}
        isLoading={isLoading}
        handleLogin={(userCredentials) => handleLogin(userCredentials)}
        handleLogout={handleLogout}
        user={user ? user : null}
        flushAppError={flushAppError}
        setSidebarDisplayed={setSidebarDisplayed}
      />
      <div className="lower">
        {sidebarDisplayed && (
          <Sidebar
            topics={data}
            user={user}
            isLoading={isLoading}
            flushAppError={flushAppError}
          />
        )}
        {/* {!user && <WelcomeScreen setIsLoading={setIsLoading} />} */}
        <Routes
          topics={data}
          user={user}
          isLoading={isLoading}
          handleLogout={handleLogout}
          registerUser={registerUser}
          resetPassword={resetPassword}
          triggerUpdate={triggerUpdate}
          error={error}
          flushAppError={flushAppError}
          handleError={handleError}
          setSidebarDisplayed={setSidebarDisplayed}
          handleCreateTopic={user ? createTopic : createTopicGuest}
          deleteCurrentTopic={user ? deleteTopic : deleteTopicGuest}
          handleLogin={(userCredentials) => handleLogin(userCredentials)}
          handleEditTopic={user ? editTopic : editTopicGuest}
          handleCreateLink={user ? createLink : handleLinksGuest}
          handleDeleteLink={user ? deleteLink : handleLinksGuest}
          editCurrentLink={user ? editLink : handleLinksGuest}
        />
      </div>
    </>
  );
}

export default App;
export { guestDB };
