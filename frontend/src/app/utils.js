// **** Shared functions **** //
import React from "react";

// Frontend data retrieval to be replaced with rest API
import { v4 as uuidv4 } from "uuid";
// returns the whole data for each topic from mockDB in App, undefined if no result
const getTopicData = (dataBase, topicToFind) => {
  return dataBase.find((x) => x.topic === topicToFind);
};

const displayLinks = (topic) => {
  return topic.links.map((link) => {
    return (
      <li key={uuidv4()} className="list-group-item">
        <a href={link.url}>{link.title}</a>
      </li>
    );
  });
};

export default getTopicData;
export { displayLinks };
