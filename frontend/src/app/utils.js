// **** Shared functions **** //
import React from "react";

// Frontend data retrieval to be replaced with rest API
import { v4 as uuidv4 } from "uuid";

// returns the whole data for each topic from mockDB in App, undefined if no result
const getTopicData = (db, query) => {
  console.log("db: " + Object.values(db[0]));
  console.log("query: " + query);
  //return dataBase.find((x) => x.topic === topicToFind);
  // TODO fix bug: stops after first element
  for (var i = 0; i < db.length; i++) {
    if (db[i].topic === query) {
      console.log("found in db:" + db[i].topic);
      return db[i];
    } // check if there's a sublevels array
    if (Array.isArray(db[i].sublevels)) {
      return getTopicData(db[i].sublevels, query);
    }
  }
};

function displayLinks(topic) {
  return topic.links.map((link) => {
    return (
      <li key={uuidv4()} className="list-group-item">
        <a href={link.url}>{link.title}</a>
      </li>
    );
  });
}

export default getTopicData;
export { displayLinks };
