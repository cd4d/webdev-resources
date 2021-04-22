import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./modal.css";
Modal.setAppElement("#root");

export default function DeleteLink(props) {
  //console.log(props);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);

  let topicToEdit = props.displayedTopic;

  function closeModal() {
    setIsOpen(false);
  }
  useEffect(() => {
    setShowDeleteConfirmation(false);
  }, []);
  function toggleDeleteConfirmation() {
    setShowDeleteConfirmation((prevState) => !prevState);
  }
  async function handleDelete() {
    setShowDeleteConfirmation(true);
    if (props.user) {
      await props.handleDeleteLink({
        topicId: topicToEdit._id,
        linkId: props.currentLink._id,
      });
      props.triggerUpdate();
    } else {
      props.handleDeleteLink(
        {
          topic: props.displayedTopic,
          linkId: props.currentLink._id,
        },
        "deleteLink"
      );
      props.triggerUpdate();
    }
  }

  return (
    <>
      {!showDeleteConfirmation ? (
        <>
          {" "}
          <span className="blank-space"></span>
          <button
            className="btn-delete-link"
            onClick={toggleDeleteConfirmation}
          >
            <span className="gg-trash" title="Delete link"></span>
          </button>
        </>
      ) : (
        <span className="confirm-cancel-container">
          <button
            onClick={handleDelete}
            className="btn-confirm-cancel confirm-delete-link"
          >
            <span className="gg-check-r" title="Confirm"></span>
          </button>
          <button
            onClick={toggleDeleteConfirmation}
            className="btn-confirm-cancel cancel-delete-link"
          >
            <span className="gg-close-o" title="Cancel"></span>
          </button>
        </span>
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        className="Modal addTopicModal"
      >
        <button onClick={closeModal} id="button-close-modal">
          close
        </button>
        {/* {props.noUserLoggedIn} */}
      </Modal>
    </>
  );
}
