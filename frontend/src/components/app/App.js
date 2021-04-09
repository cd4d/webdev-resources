import React, { useState, useEffect } from "react";
import Header from "../header/Header";
import Sidebar from "../sidebar/Sidebar";
import Routes from "../../routes/routes";
import { useHistory } from "react-router-dom";
import guestDB from "../../DB/guestDB.json";
import { v4 as uuidv4 } from "uuid";

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
} from "../../api/api-calls";

// keep last for CSS order
import "./icons.css";
import "./App.css";
import { slugify } from "../../utils/utils";

function App() {
  // list of topics

  const [data, setData] = useState(
    window.localStorage.getItem("guestDB")
      ? JSON.parse(window.localStorage.getItem("guestDB"))
      : guestDB
  );
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarDisplayed, setSidebarDisplayed] = useState(true);
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

  // update the guest data from window.localStorage in guest mode
  useEffect(() => {
    if (!user) {
      const json = JSON.stringify(data);
      window.localStorage.setItem("guestDB", json);
    }
  }, [user, data]);

  function triggerUpdate() {
    setError(null);
    setUpdated((prevState) => !prevState);
  }

  function flushAppError() {
    setError(null);
  }
  //  login and setting current user
  async function handleLogin(userCredentials) {
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
  // create topic and redirect to it
  async function handleCreateTopic(newTopic) {
    if (!user) {
      newTopic._id = uuidv4();
      newTopic.slug = slugify(newTopic.title);
      newTopic.links = [];
      newTopic.user = null;
      setData((prevState) => [...prevState, newTopic]);
      triggerUpdate();
      return history.push("/" + newTopic.slug);
    }
    const response = await createTopic(newTopic);
    // error handling
    if (response && response.status >= 400) {
      handleError(response);
      setIsLoading(false);
      return response;
    } else if (response) {
      triggerUpdate();
      history.push("/" + newTopic.slug);
    }
  }
  // delete topic
  async function deleteCurrentTopic(topicId) {
    if (!user) {
      setData((prevState) =>
        prevState.filter((topic) => topic._id !== topicId)
      );
      return history.push("/");
    }
    const response = await deleteTopic(topicId);
    if (!response) {
      setError({
        status: response.status,
        statusText: response.statusText,
        operation: "deleteLink",
        on: "link",
      });
    }
    triggerUpdate();
    history.push("/");
  }

  // edit topic - add link - delete link
  async function handleEditTopic(topicId, payload) {
    // guest user using localStorage
    if (!user) {
      // slugify title if changed
      if (payload.title) {
        payload.slug = slugify(payload.title);
      }
      setData(
        [...data].map((topic) => {
          if (topic._id === topicId) {
            return { ...topic, ...payload };
          } else {
            return topic;
          }
        })
      );
      if (payload.title) {
        return history.push("/" + payload.slug);
      }
      return;
    }
    try {
      const response = await editTopic(topicId, payload);
      // error handling
      if (response && response.status >= 400) {
        console.log("error status not 200 ", response);
        handleError(response);
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
  }
  // links function for guest user, using localStorage
  async function handleLinkNoUser(payload, operation) {
    if (!user) {
      const topicContainingLink = data.find(
        (topic) => topic._id === payload.topic._id
      );
      if (operation === "createLink") {
        topicContainingLink.links.push({
          _id: uuidv4(),
          url: payload.url,
          summary: payload.summary,
        });
      }
      if (operation === "deleteLink") {
        const indexOfLinkToDelete = topicContainingLink.links.findIndex(
          (link) => link._id === payload.linkId
        );
        topicContainingLink.links.splice(indexOfLinkToDelete, 1);
      }
      if (operation === "editLink") {
        topicContainingLink.links = topicContainingLink.links.map((link) => {
          if (link._id === payload.linkId) {
            return { ...link, ...payload.newData };
          } else {
            return link;
          }
        });
      }
      console.log("new links:", topicContainingLink.links);
      // https://stackoverflow.com/questions/49477547/setstate-of-an-array-of-objects-in-react
      setData(
        [...data].map((topic) => {
          if (topic._id === topicContainingLink._id) {
            return { ...topic, links: topicContainingLink.links };
          } else {
            return topic;
          }
        })
      );
    }
  }

  async function editCurrentLink(linkId, changedData) {
    try {
      const response = await editLink(linkId, changedData);
      if (response && response.status >= 400) {
        console.log("error status not 200: ", response);

        handleError(response);
        setIsLoading(false);
        return response;
      } else if (response && response.status === 200) {
        triggerUpdate();
      }
    } catch (err) {
      console.log("error updating data :", err);
      setError(err);
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

        <Routes
          topics={data}
          user={user}
          isLoading={isLoading}
          handleLogin={(userCredentials) => handleLogin(userCredentials)}
          handleLogout={handleLogout}
          registerUser={registerUser}
          resetPassword={resetPassword}
          handleCreateTopic={handleCreateTopic}
          deleteCurrentTopic={deleteCurrentTopic}
          triggerUpdate={triggerUpdate}
          handleEditTopic={handleEditTopic}
          handleCreateLink={user ? createLink : handleLinkNoUser}
          handleDeleteLink={user ? deleteLink : handleLinkNoUser}
          editCurrentLink={user ? editCurrentLink : handleLinkNoUser}
          error={error}
          flushAppError={flushAppError}
          handleError={handleError}
        />
      </div>
    </>
  );
}

export default App;
export { guestDB };
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

// // create link
// async function createNewLink(linkId) {
//   try {
//     const response = await createLink(linkId);
//     if (response && response.status >= 400) {
//       console.log("error status not 200: ", response);
//       let newError = {
//         status: response.status,
//         statusText: response.statusText,
//         operation: "editLink",
//         on: "link",
//       };
//       setError(newError);
//       setIsLoading(false);
//       return response;
//     }
//   } catch (err) {
//     console.log("error updating data :", err);
//     setError(err);
//   }
//   triggerUpdate();
// }

// register user
// async function handleRegister(userCredentials) {
//   const response = await registerUser(userCredentials);
//   console.log("response is:", response);
//   if (response && response.status >= 400) {
//     setError({
//       status: response.status,
//       statusText: response.statusText,
//       operation: "register",
//       on: "register",
//       errors: response.data.errors,
//     });
//     setIsLoading(false);
//     return response;
//   }
//   if (response && response.status === 200) {
//     setUser(response.loggedUser);
//   }
// }
// reset user password
// async function handleResetPassword(email) {
//   const response = await resetPassword(email);
//   console.log("response in app for reset pw: ", response);
//   if (response && response.resetLink) {
//     return { resetLink: response.resetLink };
//   }
//   if (response && response.status) {
//     return { status: response.status, statusText: response.statusText };
//   }
// }
// case "addLink":
//   setIsLoading(true);
//   try {
//     console.log("topicToUpdate: ", topicToUpdate);
//     console.log("payload: ", payload);
//     const existingLinks = topic.links;
//     const updatedLinks = { links: existingLinks.concat(payload) };

//     const response = await editTopic(topicToUpdate, updatedLinks);
//     if (response && response.status >= 400) {
//       console.log("error status not 200: ", response);
//       let newError = {
//         status: response.status,
//         statusText: response.statusText,
//         operation: "addLink",
//         on: "link",
//       }; // error if too many links
//       if (response.data) newError.message = response.data.message;
//       setError(newError);
//       setIsLoading(false);
//       return response;
//     }
//   } catch (err) {
//     console.log("error updating data :", err);
//     setError(err);
//   }
//   triggerUpdate();
//   setIsLoading(false);

//   break;
// case "deleteLink":
//   setIsLoading(true);

//   try {
//     const existingLinks = topic.links;
//     const updatedLinks = {
//       links: existingLinks.filter((link) => link._id !== payload._id),
//     };

//     const response = await editTopic(topicToUpdate, updatedLinks);
//     if (response && response.status >= 400) {
//       // console.log("error response :", response);
//       setError({
//         status: response.status,
//         statusText: response.statusText,
//         operation: "deleteLink",
//         on: "link",
//       });
//       setIsLoading(false);
//       return response;
//     }
//   } catch (err) {
//     console.log("error updating data :", err);
//     setError(err);
//   }
//   triggerUpdate();
//   setIsLoading(false);

//   break;

// this case takes the id of the topic
//setIsLoading(true);
