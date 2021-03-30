import React, { useState, useEffect } from "react";
import mockDB from "../../DB/mockDB.json";
import Header from "../header/Header";
import Sidebar from "../sidebar/Sidebar";
import Routes from "../../routes/routes";
import { useHistory, Redirect } from "react-router-dom";

import {
  fetchUserTopics,
  fetchCurrentUser,
  loginUser,
  registerUser,
  logoutUser,
  createTopic,
  deleteTopic,
  editTopic,
  resetPassword,
} from "../../api/api-calls";

// keep last for CSS order
import "./icons.css";
import "./App.css";

function App() {
  // list of topics
  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [error, setError] = useState(null);
  // useHistory from react-router for redirection
  const history = useHistory();

  //  login and setting current user
  async function handleLogin(userCredentials) {
    const response = await loginUser(userCredentials);
    console.log("response is:", response);
    if (response && response.status >= 400) {
      setError({
        status: response.status,
        statusText: response.statusText,
        operation: "login",
        on: "login",
      });
      return response;
    }
    if (response && response.status === 200) {
      setUser(response.loggedUser);
    }
  }

  // logout user
  async function handleLogout() {
    const response = await logoutUser();
    if (response) {
      setData([]);
      setUser(null);
      <Redirect to="/" />;
    }
  }
  // register user
  async function handleRegister(userCredentials) {
    const response = await registerUser(userCredentials);
    console.log("response is:", response);
    if (response && response.status >= 400) {
      setError({
        status: response.status,
        statusText: response.statusText,
        operation: "register",
        on: "register",
        errors: response.data.errors,
      });
      setIsLoading(false);
      return response;
    }
    if (response && response.status === 200) {
      setUser(response.loggedUser);
    }
  }

  // reset user password
  async function handleResetPassword(email) {
    const response = await resetPassword(email);
    console.log("response in app for reset pw: ", response);
    if (response && response.resetLink) {
      return { resetLink: response.resetLink };
    }
    if (response && response.status) {
      return { status: response.status, statusText: response.statusText };
    }
  }

  // get current user at start
  useEffect(() => {
    const getCurrentUser = async () => {
      const response = await fetchCurrentUser();
      if (response.currentUser) {
        setUser(response.currentUser.username);
      }
    };
    getCurrentUser();
  }, [user]);

  // get the current user's topics when user changes/ update triggered
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetchUserTopics();
        setData(response);
      } catch (err) {
        setError(err);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [user, updated]);

  function triggerUpdate() {
    setError(null);
    setUpdated((prevState) => !prevState);
  }

  function flushAppError() {
    setError(null);
  }
  // create topic and redirect to it
  async function createNewTopic(newTopic) {
    const response = await createTopic(newTopic);
    // error handling
    if (response && response.status >= 400) {
      console.log("error in app.js: ", response);
      setError({
        status: response.status,
        statusText: response.statusText,
        operation: "createTopic",
        on: "topic",
      });
      setIsLoading(false);
      return response;
    } else if (response) {
      triggerUpdate();
      history.push("/" + newTopic.slug);
    }
  }
  // delete topic
  async function deleteCurrentTopic(topicId) {
    const response = await deleteTopic(topicId);
    triggerUpdate();
    history.push("/");
  }

  // edit topic - add link - delete link
  async function editDisplayedTopic(topic, payload, operation = null) {
    console.log("editing current topic, topic:", topic);

    console.log("editing current topic, payload:", payload);
    console.log("editing current topic, operation:", operation);
    let topicToUpdate = topic._id;
    switch (operation) {
      case "addLink":
        setIsLoading(true);
        try {
          console.log("topicToUpdate: ", topicToUpdate);
          console.log("payload: ", payload);
          const existingLinks = topic.links;
          const updatedLinks = { links: existingLinks.concat(payload) };

          const response = await editTopic(topicToUpdate, updatedLinks);
          if (response && response.status >= 400) {
            console.log("error status not 200");
            setError({
              status: response.status,
              statusText: response.statusText,
              operation: "addLink",
              on: "link",
            });
            setIsLoading(false);
            return response;
          }
        } catch (err) {
          console.log("error updating data :", err);
          setError(err);
        }
        triggerUpdate();
        setIsLoading(false);

        break;
      case "deleteLink":
        setIsLoading(true);

        try {
          const existingLinks = topic.links;
          const updatedLinks = {
            links: existingLinks.filter((link) => link._id !== payload._id),
          };

          const response = await editTopic(topicToUpdate, updatedLinks);
          if (response && response.status >= 400) {
            // console.log("error response :", response);
            setError({
              status: response.status,
              statusText: response.statusText,
              operation: "deleteLink",
              on: "link",
            });
            setIsLoading(false);
            return response;
          }
        } catch (err) {
          console.log("error updating data :", err);
          setError(err);
        }
        triggerUpdate();
        setIsLoading(false);

        break;
      case "editTopic":
        // this case takes the id of the topic
        //setIsLoading(true);
        try {
          const response = await editTopic(topic, payload);
          // error handling
          if (response && response.status >= 400) {
            console.log("error status not 200 ", response);
            setError({
              status: response.status,
              statusText: response.statusText,
              operation: "editTopic",
              on: "topic",
            });
            setIsLoading(false);
            return response;
          } else if (response && response.status === 200) {
            console.log("can edit response: ", response);
            setIsLoading(false);
            triggerUpdate();
            history.push("/" + response.data.slug);
          }
        } catch (err) {
          console.log("error updating data :", err);
          setError(err);
        }

        break;
      default:
        setData(payload);
        break;
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
      />
      <div className="lower">
        {/* only show sidebar if a user is logged in */}
        {<Sidebar topics={data} user={user} isLoading={isLoading} />}

        <Routes
          topics={data}
          user={user}
          //pass data if there's a user logged in
          isLoading={isLoading}
          handleLogin={(userCredentials) => handleLogin(userCredentials)}
          handleLogout={handleLogout}
          handleRegister={handleRegister}
          handleResetPassword={handleResetPassword}
          createNewTopic={createNewTopic}
          deleteCurrentTopic={deleteCurrentTopic}
          triggerUpdate={triggerUpdate}
          editDisplayedTopic={editDisplayedTopic}
          error={error}
          flushAppError={flushAppError}
        />
      </div>
    </>
  );
}

export default App;
export { mockDB };

// update the data from current topic when it's edited
// useEffect(() => {
//   const updateData = async () => {
//     setIsLoading(true);
//     try {
//       console.log("topicToUpdate: ", topicToUpdate);
//       console.log("changedData: ", changedData);

//       const response = await editTopic(topicToUpdate, changedData);
//       if (response && response.status >= 400) {
//         console.log("error response :", response);

//         setError({
//           status: response.status,
//           statusText: response.statusText,
//         });
//         return response;
//       }
//       setIsLoading(false);
//     } catch (err) {
//       console.log("error updating data :", err);
//       setError(err);
//       setIsLoading(false);
//     }
//   };
//   updateData();
// }, [topicToUpdate, changedData]);
