import React, { useState } from "react";
import Modal from "react-modal";
import "./modal.css";
Modal.setAppElement("#root");

export default function DeleteTopic(props) {
  const [modalIsOpen, setIsOpen] = useState(false);
  let topicToDelete = props.displayedTopic;
  const userLoggedIn = (
    <>
      {" "}
      <h2>
        Delete topic:{" "}
        {props.displayedTopic && `"${props.displayedTopic.title}"?`}
      </h2>
      <form onSubmit={handleSubmit}>
        <button>Yes</button>
      </form>
    </>
  );
  function openModal() {
    setIsOpen(true);
    props.flushAppError();
  }
  function closeModal() {
    setIsOpen(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    props
      .deleteCurrentTopic(topicToDelete._id)
      .then(props.triggerUpdate())
      .then(closeModal());
  }

  return (
    <>
      <button className="btn btn-delete-topic" onClick={openModal}>
        Delete Topic
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        className="Modal deleteTopicModal"
      >
        <button onClick={closeModal} id="button-close-modal">
          close
        </button>
        {/* {props.user ? userLoggedIn : props.noUserLoggedIn} */}
        {userLoggedIn}
      </Modal>
    </>
  );
}
