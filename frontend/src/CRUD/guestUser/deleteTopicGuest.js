export async function deleteTopicGuest(topicToDelete) {
  let storage = JSON.parse(window.localStorage.getItem("guestDB") || []);
  // Child topic deleted:
  if (topicToDelete.parent) {
    // find the parent Topic
    let parentTopic = storage.filter(
      (topic) => topicToDelete.parent && topic._id === topicToDelete.parent
    )[0];

    // update parent topic's children list
    let newChildren = parentTopic.children.filter(
      (childTopic) => childTopic._id !== topicToDelete._id
    );
    // replace the children list
    if (parentTopic) {
      storage.map((topic) => {
        if (topic._id === parentTopic._id) {
          topic.children = newChildren;
          return topic;
        }
        return topic;
      });
    }
  }
  // Parent topic deleted:
  // keep children topics if option selected
  if (topicToDelete.keepChildrenTopics) {
    storage.map((topic) => {
      if (topicToDelete._id === topic.parent) {
        topic.depth = 0;
        topic.parent = null;
        return topic;
      }
      return topic;
    });
    // Or delete children topics
  } else {
    storage = storage.filter((topic) => topicToDelete._id !== topic.parent);
  }
  // Delete the topic
  storage = storage.filter((topic) => topic._id !== topicToDelete._id);
  window.localStorage.setItem("guestDB", JSON.stringify(storage));
}
