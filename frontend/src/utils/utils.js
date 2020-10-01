// **** Shared functions **** //
import React from "react";

// Frontend data retrieval to be replaced with rest API
import { v4 as uuidv4 } from "uuid";

// returns the whole data for each topic from mockDB in App, undefined if no result
const getTopicData = (db, query) => {
  for (var i = 0; i < db.length; i++) {
    if (db[i].topic === query) {
      return db[i];
    } // check if there's a sublevel
    if (Array.isArray(db[i].sublevels)) {
      const result = getTopicData(db[i].sublevels, query);
      if (result) return result;
    }
  }
};

function displayLinks(topic) {
  if (topic.links){
    return topic.links.map((link) => {
    return (
      <li key={uuidv4()} className="list-group-item">
        <a href={link.url}>{link.title}</a>
      </li>
    );
  });}
  return (<p>No links provided.</p>)
  
}

export default getTopicData;
export { displayLinks };
