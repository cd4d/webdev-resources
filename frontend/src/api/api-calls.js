// Functions to make API calls to the backend
import axios from "axios";
import { slugify } from "../utils/utils";
// to be changed in production
const API_SERVER = "http://localhost:3000";

// common parameters for axios: https://flaviocopes.com/axios-credentials/ a
const axiosConnection = axios.create({
  withCredentials: true,
  baseURL: API_SERVER,
});

function handleError(error) {
  if (error.response) {
    console.log("api-call error response: ", error.response);
    // client received an error response (5xx, 4xx)
    return error.response;
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
  const response = await axiosConnection("/api/users/current");
  //console.log("user Response:", response);
  return response.data;
}
// user credentials
export async function loginUser(credentials) {
  try {
    const response = await axiosConnection.post(
      "/api/users/login",
      credentials
    );
    console.log("login Response:", response);
    return response;
  } catch (error) {
    return handleError(error);
  }
}

export async function logoutUser() {
  try {
    const response = await axiosConnection(API_SERVER + "/api/users/logout");
    // console.log("logout Response:", response);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function registerUser(credentials) {
  try {
    const response = await axiosConnection.post(
      "/api/users/register",
      credentials
    );
    console.log("registered Response:", response);
    return response;
  } catch (error) {
    return handleError(error);
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
    return handleError(error);
  }
}

export async function fetchUserTopics() {
  try {
    const response = await axiosConnection(API_SERVER + "/api/topics/");
    // console.log("User topics Response:", response);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}
export async function fetchTopicData(topic) {
  try {
    const response = await axiosConnection("/api/topics/" + topic);
    // console.log("Topic Response:", response);
    return response.data;
  } catch (error) {
    return handleError(error);
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
    return handleError(error);
  }
}

// modify topic
export async function editTopic(topicId, changedData) {
  console.log(topicId);

  try {
    if (topicId) {
      const response = await axiosConnection.patch(
        "/api/topics/" + topicId,
        changedData
      );
      console.log("Edit Topic Response:", response);
      return { data: response.data, status: response.status };
    }
  } catch (error) {
    return handleError(error);
  }
}
export async function createLink(newLink) {
  //console.log(linkId);

  try {
    if (newLink) {
      const response = await axiosConnection.post("/api/links/", newLink);
      console.log("Create Link Response:", response);
      return { data: response.data, status: response.status };
    }
  } catch (error) {
    return handleError(error);
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
    return handleError(error);
  }
}

export async function deleteTopic(topicId) {
  try {
    console.log("topic to delete:", topicId);
    const response = await axiosConnection.delete("/api/topics/" + topicId);
    console.log("Delete Topic Response:", response);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}
