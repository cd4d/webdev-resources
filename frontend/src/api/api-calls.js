// Functions to make API calls to the backend
import axios from "axios";
// to be changed in production
const URL = "http://localhost:3000";

export async function fetchTopicData(topic) {
  const response = await axios(URL + "/api/topics/" + topic);
  console.log("Topic Response:", response);
  return response.data;
}

// get current user
export async function fetchUser() {
  const response = await axios(URL + "/api/users/current");
  //console.log("user Response:", response);
  return response.data;
}
// user credentials
export async function loginUser(credentials) {
  const response = await axios.post(URL + "/api/users/login", credentials);
  console.log("login Response:", response);
  return response.data;
}

export async function fetchUserTopics() {
  const response = await axios(URL + "/api/topics/");
  console.log("User topics Response:", response);
  return response.data;
}
