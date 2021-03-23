import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./modal.css";
Modal.setAppElement("#root");

export default function DeleteLink(props) {
  //console.log(props);
  const [deleteLinkClicked, setDeleteLinkClicked] = useState(false);

  let topicToEdit = props.displayedTopic;

  useEffect(() => {
    setDeleteLinkClicked(false);
  }, []);
  function changeDeleteLinkClicked() {
    setDeleteLinkClicked((prevState) => !prevState);
  }
  function deleteLink() {
    setDeleteLinkClicked(true);

    props.editDisplayedTopic(topicToEdit, props.currentLink, "deleteLink");
    props.triggerUpdate();
  }

  return (
    <>
      {!deleteLinkClicked ? (
        <button onClick={changeDeleteLinkClicked}>Delete Link</button>
      ) : (
        <>
          <button onClick={deleteLink}>Yes</button>
          <button onClick={changeDeleteLinkClicked}>No</button>
        </>
      )}
    </>
  );
}
