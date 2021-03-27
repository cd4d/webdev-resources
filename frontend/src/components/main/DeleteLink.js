import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./modal.css";
Modal.setAppElement("#root");

export default function DeleteLink(props) {
  //console.log(props);
  const [deleteLinkClicked, setDeleteLinkClicked] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);

  let topicToEdit = props.displayedTopic;
  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }
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
        <div>
          <span className="blank-space"></span>
          <button
            className="btn-delete-link"
            onClick={props.user ? changeDeleteLinkClicked : openModal}
          >
            <span className="gg-trash" title="Delete link"></span>
          </button>
        </div>
      ) : (
        <div className="confirm-cancel-container">
          <button
            onClick={deleteLink}
            className="btn-confirm-cancel confirm-delete-link"
          >
            <span className="gg-check-r" title="Confirm"></span>
          </button>
          <button
            onClick={changeDeleteLinkClicked}
            className="btn-confirm-cancel cancel-delete-link"
          >
            <span className="gg-close-o" title="Cancel"></span>
          </button>
        </div>
      )}{" "}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        className="Modal addTopicModal"
      >
        <button onClick={closeModal} id="button-close-modal">
          close
        </button>
        {props.noUserLoggedIn}
      </Modal>
    </>
  );
}
