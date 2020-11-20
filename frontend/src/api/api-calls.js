// Functions to make API calls to the backend
import axios from "axios";
// to be changed in production
const URL = "http://localhost:3000";

export async function fetchTopicData(topic) {
  const response = await axios(URL + "/api/topics/" + topic);
  console.log("Response:", response);
  return response.data;
}

export async function fetchUserTopics() {
  const response = await axios(URL + "/api/topics/");
  console.log("Response:", response);
  return response.data;
}