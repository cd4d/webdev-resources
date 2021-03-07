// Functions to make API calls to the backend
import axios from "axios";
// to be changed in production
const API_SERVER = "http://localhost:3000";

// common parameters for axios: https://flaviocopes.com/axios-credentials/ a
const axiosConnection = axios.create({
  withCredentials: true,
  baseURL: API_SERVER,
});

export async function fetchTopicData(topic) {
  const response = await axiosConnection("/api/topics/" + topic);
  console.log("Topic Response:", response);
  return response.data;
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
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function logoutUser() {
  const response = await axiosConnection(API_SERVER + "/api/users/logout");
  console.log("logout Response:", response);
  return response.data;
}

export async function fetchUserTopics() {
  const response = await axiosConnection(API_SERVER + "/api/topics/");
  console.log("User topics Response:", response);
  return response.data;
}
