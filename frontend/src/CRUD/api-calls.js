// Functions to make API calls to the backend
import axios from "axios";
import slugify from "../utils/utils";
// to be changed in production
const API_SERVER = "http://localhost:3000";

// common parameters for axios: https://flaviocopes.com/axios-credentials/ a
const axiosConnection = axios.create({
  withCredentials: true,
  baseURL: API_SERVER,
});

function returnError(error, context) {
  if (error.response) {
    const returnedError = { ...error.response, ...context };
    console.log("api-call error response: ", returnedError);
    // client received an error response (5xx, 4xx)
    return returnedError;
  } else if (error.request) {
    // client never received a response, or request never left
    console.log("api-call error request: ", error.request);

    return error.request;
  } else {
    // anything else
    console.log("api-call error else: ", error);

    return error;
  }
}

// get current user
export async function fetchCurrentUser() {
  try {
    const response = await axiosConnection("/api/users/current");
    return response.data;
  } catch (error) {
    return returnError(error, { operation: "getUser", on: "user" });
  }
}
// login user credentials
export async function loginUser(credentials) {
  try {
    const response = await axiosConnection.post(
      "/api/users/login",
      credentials
    );
    return response;
  } catch (error) {
    return returnError(error, { operation: "loginUser", on: "user" });
  }
}

export async function logoutUser() {
  try {
    const response = await axiosConnection(API_SERVER + "/api/users/logout");
    // console.log("logout Response:", response);
    return response.data;
  } catch (error) {
    return returnError(error, { operation: "logoutUser", on: "user" });
  }
}

export async function registerUser(credentials) {
  try {
    const response = await axiosConnection.post(
      "/api/users/register",
      credentials
    );
    return response;
  } catch (error) {
    return returnError(error, { operation: "registerUser", on: "user" });
  }
}

export async function resetPassword(email) {
  try {
    const response = await axios.post(
      API_SERVER + "/api/users/reset-password",
      email
    );
    console.log("reset pw response: ", response);
    return response.data;
  } catch (error) {
    return returnError(error, { operation: "resetPassword", on: "user" });
  }
}

export async function fetchUserTopics() {
  try {
    const response = await axiosConnection(API_SERVER + "/api/topics/");
    // console.log("User topics Response:", response);
    return response.data;
  } catch (error) {
    return returnError(error, { operation: "getUser", on: "user" });
  }
}
export async function fetchTopicData(topic) {
  try {
    const response = await axiosConnection("/api/topics/" + topic);
    // console.log("Topic Response:", response);
    return response.data;
  } catch (error) {
    return returnError(error, { operation: "getTopic", on: "topic" });
  }
}
// add topic and generate url slug
export async function createTopic(topic) {
  try {
    if (topic) {
      topic.slug = slugify(topic.title);
    }
    const response = await axiosConnection.post("/api/topics/", topic);
    // console.log("New Topic Response:", response);
    return { data: response.data, status: response.status };
  } catch (error) {
    return returnError(error, { operation: "createTopic", on: "topic" });
  }
}

// modify topic
export async function editTopic(topic, changedData) {
  console.log(topic);
  console.log(changedData);
  try {
    if (topic) {
      const response = await axiosConnection.patch(
        "/api/topics/" + topic._id,
        changedData
      );
      console.log("Edit Topic Response:", response);
      return { data: response.data, status: response.status };
    }
  } catch (error) {
    return returnError(error, { operation: "editTopic", on: "topic" });
  }
}

// delete topic
export async function deleteTopic(parameters) {
  try {
    console.log("topic to delete:", parameters._id);
    let response;
    if (parameters.keepChildrenTopics) {
      response = await axiosConnection.delete("/api/topics/" + parameters._id, {
        data: { keepChildrenTopics: parameters.keepChildrenTopics },
      });
    } else {
      response = await axiosConnection.delete("/api/topics/" + parameters._id);
    }

    console.log("Delete Topic Response:", response);
    return response.data;
  } catch (error) {
    returnError(error, { operation: "deleteTopic", on: "link" });
  }
}
// get link preview for guest user
export async function getLinkPreview(url) {
  try {
    const response = await axios.post(API_SERVER + "/api/links/link-preview/", {
      url,
    });
    return response;
  } catch (error) {
    return returnError(error, { operation: "getLinkPreview", on: "link" });
  }
}

// add link
export async function createLink(newLink) {
  //console.log(linkId);

  try {
    if (newLink) {
      const response = await axiosConnection.post("/api/links/", newLink);
      console.log("Create Link Response:", response);
      return { data: response.data, status: response.status };
    }
  } catch (error) {
    return returnError(error, { operation: "createLink", on: "link" });
  }
}
// delete link
// delete body must be passed into data object https://github.com/axios/axios/issues/897
export async function deleteLink(parameters) {
  try {
    if (parameters.topicId && parameters.linkId) {
      console.log(parameters);
      const response = await axiosConnection.delete("/api/links/", {
        data: parameters,
      });
      console.log("Delete Link Response:", response);
      return response;
    }
  } catch (error) {
    return returnError(error, { operation: "deleteLink", on: "link" });
  }
}

// modify link
export async function editLink(linkId, changedData) {
  //console.log(linkId);

  try {
    if (linkId) {
      const response = await axiosConnection.patch(
        "/api/links/" + linkId,
        changedData
      );
      console.log("Edit Link Response:", response);
      return { data: response.data, status: response.status };
    }
  } catch (error) {
    return returnError(error, { operation: "editLink", on: "link" });
  }
}
