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
  createTopic,
  deleteTopic,
  editTopic,
} from "../../api/api-calls";

import "./App.css"; // keep last for CSS order

function App() {
  // list of topics
  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [updated, setUpdated] = useState(false);
  // const [changedData, setChangedData] = useState(null);
  // const [topicToUpdate, setTopicToUpdate] = useState(null);
  const [error, setError] = useState(null);
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
    if (user) {
      fetchData();
    }
  }, [user, updated]);

  // update the data from current topic when it's edited
  // useEffect(() => {
  //   const updateData = async () => {
  //     setIsLoading(true);
  //     try {
  //       console.log("topicToUpdate: ", topicToUpdate);
  //       console.log("changedData: ", changedData);

  //       const response = await editTopic(topicToUpdate, changedData);
  //       if (response && response.status !== 200) {
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

  function triggerUpdate() {
    setError(null);
    setUpdated((prevState) => !prevState);
  }

  // add topic and redirect to it
  async function createNewTopic(newTopic) {
    const response = await createTopic(newTopic);
    // error handling
    if (response && response.status >= 400) {
      console.log("error status not 200");

      setError({
        status: response.status,
        statusText: response.statusText,
        operation: "editTopic",
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
    let changedData = payload;
    let topicToUpdate = topic._id;
    switch (operation) {
      case "addLink":
        setIsLoading(true);
        try {
          console.log("topicToUpdate: ", topicToUpdate);
          console.log("changedData: ", changedData);
          const existingLinks = topic.links;
          const updatedLinks = { links: existingLinks.concat(changedData) };

          const response = await editTopic(topicToUpdate, updatedLinks);
          if (response && response.status !== 200) {
            console.log("error status not 200");
            setError({
              status: response.status,
              statusText: response.statusText,
              operation: "addLink",
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
            links: existingLinks.filter((link) => link._id !== changedData._id),
          };

          const response = await editTopic(topicToUpdate, updatedLinks);
          if (response && response.status !== 200) {
            // console.log("error response :", response);
            setError({
              status: response.status,
              statusText: response.statusText,
              operation: "deleteLink",
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
        setIsLoading(true);
        try {
          const response = await editTopic(topic, payload);
          // error handling
          if (response && response.status !== 200) {
            console.log("error status not 200");
            setError({
              status: response.status,
              statusText: response.statusText,
              operation: "editTopic",
            });
            setIsLoading(false);
            return response;
          }
          if (response && response.status === 200) {
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
        {user && <Sidebar topics={data} user={user} isLoading={isLoading} />}

        <Routes
          topics={user && data}
          user={user}
          //pass data if there's a user logged in
          isLoading={isLoading}
          handleLogin={(userCredentials) => handleLogin(userCredentials)}
          handleLogout={handleLogout}
          createNewTopic={createNewTopic}
          deleteCurrentTopic={deleteCurrentTopic}
          triggerUpdate={triggerUpdate}
          editDisplayedTopic={editDisplayedTopic}
          error={error}
        />
      </div>
    </>
  );
}

export default App;
export { mockDB };
