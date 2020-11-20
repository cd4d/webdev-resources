const mockDB = require("../DB/mockDB.json");

const buildNavigationPath = (db, query) => {
  for (var i = 0; i < db.length; i++) {
    // add traversed topic or reinitialize array
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
        return [].concat(parentTopics,foundTopic)
      }
    }
  }
};

let res = buildNavigationPath(mockDB, "express2");
console.log("Final:", res);
