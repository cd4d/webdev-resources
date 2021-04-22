// **** Shared functions **** //
import React from "react";
import { NavLink } from "react-router-dom";
// Frontend data retrieval to be replaced with rest API
import { v4 as uuidv4 } from "uuid";

function displayLinks(currentTopicLinks) {
  return currentTopicLinks.map((link) => (
    <li key={uuidv4()} id={link._id} className="list-group-item">
      <a href={link.url}>{link.description}</a>
    </li>
  ));
}
// builds the navigation path, traversing the array of topics recursively
const buildNavigationPath = (allTopics, currentTopic) => {
  for (let topic of allTopics) {
    // add traversed topic
    const parentTopics = [];
    if (topic) {
      parentTopics.push({ title: topic.title, slug: topic.slug });
    }
    if (topic.title === currentTopic.title) {
      return { title: currentTopic.title, slug: currentTopic.slug };
    } // check if there is a sublevel
    if (Array.isArray(topic.children) && topic.children.length !== 0) {
      const foundTopic = buildNavigationPath(topic.children, currentTopic);
      if (foundTopic) {
        // combine parentTopics and foundTopic
        return [].concat(parentTopics, foundTopic);
      }
    }
  }
};

// display the navigation path if there is one
const displayNavigationPath = (topics) => {
  if (!Array.isArray(topics)) {
    return null;
  }
  let urlTopic = "/topics";
  return topics.map((topic) => {
    // build the url by adding to it while looping
    urlTopic += "/" + topic.slug;
    return (
      <li key={uuidv4()}>
        <NavLink to={`${urlTopic}`}>
          {topic.title} {"/"}
          {""}
        </NavLink>
      </li>
    );
  });
};

// https://gist.github.com/hagemann/382adfc57adbd5af078dc93feef01fe1
// generate URL slugs from regular string Web development -> web-development
function slugify(string) {
  const a =
    "àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;";
  const b =
    "aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------";
  const p = new RegExp(a.split("").join("|"), "g");

  return string
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(p, (c) => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

// truncate opengraph description
function truncateDescription(description, maxChars) {
  if (description.length > maxChars) {
    return description.substring(0, maxChars - 3) + "...";
  }
  return description;
}

// reducer to add/remove links
function linksReducer(state, action, newLink) {
  switch (action.type) {
    case "add":
      console.log("links", state.links);
      return { links: [...state.links, newLink] };
    default:
      return state;
  }
}
// const [linksArray, dispatch] = useReducer(
//   (linksArray, { operation, newLink }) => {
//     switch (operation) {
//       case "add":
//         return [...linksArray, newLink];
//       case "delete":
//         return linksArray.filter((e, index) => index !== newLink);
//       default:
//         return linksArray;
//     }
//   }, []
// );

export default slugify;
export {
  truncateDescription,
  buildNavigationPath,
  displayNavigationPath,
  linksReducer,
};

// OLD
// const buildNavigationPath = (db, query) => {
//   for (var i = 0; i < db.length; i++) {
//     // add traversed topic
//     const parentTopics = [];
//     if (db[i].topic) {
//       parentTopics.push(db[i].topic);
//     }
//     if (db[i].topic === query) {
//       return query;
//     } // check if there is a sublevel
//     if (Array.isArray(db[i].sublevels)) {
//       const foundTopic = buildNavigationPath(db[i].sublevels, query);
//       if (foundTopic) {
//         // combine parentTopics and foundTopic
//         return [].concat(parentTopics, foundTopic);
//       }
//     }
//   }
// };
// returns the whole data for each topic in App, undefined if no result
// const getTopicData = (db, query) => {
//   for (var i = 0; i < db.length; i++) {
//     if (db[i].topic === query) {
//       return db[i];
//     } // check if there is a sublevel
//     if (Array.isArray(db[i].sublevels)) {
//       const result = getTopicData(db[i].sublevels, query);
//       if (result) return result;
//     }
//   }
// };
