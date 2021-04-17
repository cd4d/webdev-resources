import { v4 as uuidv4 } from "uuid";
import { slugify } from "../../utils/utils";

export async function createTopicGuest(newTopic) {
  const storage = JSON.parse(window.localStorage.getItem("guestDB")) || [];
  console.log("storage: ", storage);
  newTopic._id = uuidv4();
  newTopic.slug = slugify(newTopic.title);
  newTopic.links = [];
  newTopic.user = null;
  newTopic.children = [];
  newTopic.parent ? (newTopic.depth = 1) : (newTopic.depth = 0);
  // New child topic? add to the children list
  if (newTopic.parent) {
    storage.map((topic) => {
      if (topic._id === newTopic.parent) {
        topic.children.push({
          _id: newTopic._id,
          title: newTopic.title,
          slug: newTopic.slug,
        });
        return topic;
      } else {
        return topic;
      }
    });
  }
  storage.push(newTopic);
  window.localStorage.setItem("guestDB", JSON.stringify(storage));
}
