// **** Shared functions **** //
import React from "react";

// Frontend data retrieval to be replaced with rest API
import { v4 as uuidv4 } from "uuid";

// returns the whole data for each topic from mockDB in App, undefined if no result
const getTopicData = (db, query) => {
  for (var i = 0; i < db.length; i++) {
    if (db[i].topic === query) {
      return db[i];
    } // check if there is a sublevel
    if (Array.isArray(db[i].sublevels)) {
      const result = getTopicData(db[i].sublevels, query);
      if (result) return result;
    }
  }
};

function displayLinks(topic) {
  if (topic.links) {
    return topic.links.map((link) => {
      return (
        <li key={uuidv4()} className="list-group-item">
          <a href={link.url}>{link.title}</a>
        </li>
      );
    });
  }
  return <p>No links provided.</p>;
}

const buildNavigationPath = (db, query) => {
  for (var i = 0; i < db.length; i++) {
    // add traversed topic
    const parentTopics = [];
    if (db[i].topic) {
      parentTopics.push(db[i].topic);
    }
    if (db[i].topic === query) {
      return query;
    } // check if there is a sublevel
    if (Array.isArray(db[i].sublevels)) {
      const foundTopic = buildNavigationPath(db[i].sublevels, query);
      if (foundTopic) {
        // combine parentTopics and foundTopic
        return [].concat(parentTopics, foundTopic);
      }
    }
  }
};

const displayNavigationPath = (topics) => {
  if (typeof topics === "string") {
    return topics;
  }
  return topics.map((topic) => {
    return (
      <li>
        <a href={topic}>
          {topic} {"/"}{" "}
        </a>
      </li>
    );
  });
};
export default getTopicData;
export { displayLinks, buildNavigationPath, displayNavigationPath };
