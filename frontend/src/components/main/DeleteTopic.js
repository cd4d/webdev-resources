import React, { useState } from "react";
import Modal from "react-modal";
import "./modal.css";
Modal.setAppElement("#root");

export default function DeleteTopic(props) {
  const [modalIsOpen, setIsOpen] = useState(false);
  let topicToDelete = props.displayedTopic;
  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    props.deleteCurrentTopic(topicToDelete._id);
    props.triggerUpdate();
  }

  return (
    <>
      <button onClick={openModal}>Delete Topic</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        className="Modal deleteTopicModal"
      >
        <button onClick={closeModal} id="button-close-modal">
          close
        </button>
        <h2>
          Delete topic:{" "}
          {props.displayedTopic && `"${props.displayedTopic.title}"?`}
        </h2>
        <form onSubmit={handleSubmit}>
          <button>Yes</button>
        </form>
      </Modal>
    </>
  );
}
