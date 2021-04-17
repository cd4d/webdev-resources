export async function editTopicGuest(topicToEdit, editedTopic) {
  console.log("topicToEdit: ", topicToEdit);
  console.log("editedTopic: ", editedTopic);
  const oldData = JSON.parse(window.localStorage.getItem("guestDB")) || [];
  let newData;
  // TODO find out why sdebar not updated

  // change a main topic t ao child topic
  if (editedTopic.parent && editedTopic.parent !== topicToEdit._id) {
    newData = oldData.map((topic) => {
      if (topic._id === editedTopic.parent) {
        topic.children.push({
          _id: topicToEdit._id,
          title: topicToEdit.title,
          slug: topicToEdit.slug,
        });
        return topic;
      } // change children topics to  main topics
      else if (topicToEdit._id === topic.parent) {
        topic.depth -= 1;
        topic.parent = null;
      } // empty the children list from edited topic, change to child topic (depth increased)
      else if (topic._id === topicToEdit._id) {
        topic.depth += 1;
        topic.children = [];
      }
      return topic;
    });
  } // if child topic, remove the topic from previous parent list
  if (topicToEdit.parent) {
    newData = oldData.map((topic) => {
      if (topic._id === topicToEdit.parent) {
        topic.children.forEach((childTopic, index) => {
          if (childTopic._id === topicToEdit._id) {
            topic.children.splice(index, 1);
          }
        });
        return topic;
      } else {
        return topic;
      }
    });
  }
  // update
  newData = oldData.map((topic) => {
    if (topic._id === topicToEdit._id) {
      console.log("topic found:", topic);
      console.log({ ...topic, ...editedTopic });
      return { ...topic, ...editedTopic };
    } else {
      return topic;
    }
  });
  // save
  console.log("storage is:", newData);
  window.localStorage.setItem("guestDB", JSON.stringify(newData));

  //console.log(storage);
  // if (editedTopic.title) {
  //   return history.push("/topics/" + editedTopic.slug);
  // }
  return;
}
