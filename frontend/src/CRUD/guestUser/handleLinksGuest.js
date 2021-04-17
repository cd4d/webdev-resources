import { v4 as uuidv4 } from "uuid";
import { getLinkPreview } from "../api-calls";
export async function handleLinksGuest(payload, operation) {
  const oldData = JSON.parse(window.localStorage.getItem("guestDB")) || [];
  let newData;

  let breakFunction = false;
  let linkPreview = "";

  console.log("handle link payload: ", payload);
  console.log("handle link operation: ", operation);

  const topicContainingLink = oldData.find(
    (topic) => topic._id === payload.topic._id
  );
  if (
    operation === "createLink" ||
    (operation === "editLink" && payload.newData.url)
  ) {
    // check if link url exists in another topic
    let newUrl = payload.newData ? payload.newData.url : payload.url;
    oldData.map((topic) =>
      topic.links.map((link) => {
        if (link.url === newUrl) {
          //setError({ message: "Link already exists", on: "Link" });
          breakFunction = true;
        } else {
          return link;
        }
        return topic;
      })
    );
  }
  if (operation === "createLink") {
    // get link preview
    if (!breakFunction) {
      linkPreview = await getLinkPreview(payload.url);
      topicContainingLink.links.push({
        _id: uuidv4(),
        url: payload.url,
        summary: payload.summary,
        ...linkPreview.data,
      });
    }
  }

  if (operation === "editLink") {
    let editedLink = payload.newData;
    if (payload.newData.url && !breakFunction) {
      // get link preview
      linkPreview = await getLinkPreview(payload.newData.url);
      editedLink = { ...payload.newData, ...linkPreview.data };
    }

    topicContainingLink.links = topicContainingLink.links.map((link) => {
      if (link._id === payload.linkId) {
        return { ...link, ...editedLink };
      } else {
        return link;
      }
    });
  }
  if (operation === "deleteLink") {
    const indexOfLinkToDelete = topicContainingLink.links.findIndex(
      (link) => link._id === payload.linkId
    );
    topicContainingLink.links.splice(indexOfLinkToDelete, 1);
  }
  console.log("new links:", topicContainingLink.links);
  // https://stackoverflow.com/questions/49477547/setstate-of-an-array-of-objects-in-react
  if (!breakFunction) {
    newData = oldData.map((topic) => {
      if (topic._id === topicContainingLink._id) {
        return { ...topic, links: topicContainingLink.links };
      } else {
        return topic;
      }
    });
    console.log("newData: ", newData);
    window.localStorage.setItem("guestDB", JSON.stringify(newData));
    return "ok";
  }
}
