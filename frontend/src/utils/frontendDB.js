import mockDB from "../components/app/App"

const addTopic = (topic) => {
  console.log("Topic:", topic);
  if (topic.title && topic.topic) {
    mockDB.push(topic);
    console.log("Successfully added to mockDB:", topic);

  }
};
export default addTopic;
