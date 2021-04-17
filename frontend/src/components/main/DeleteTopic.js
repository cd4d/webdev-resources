import React, { useState } from "react";
import Modal from "react-modal";
import "./modal.css";
import { useHistory } from "react-router-dom";

Modal.setAppElement("#root");

export default function DeleteTopic(props) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [keepChildrenTopics, setKeepChildrenTopics] = useState(false);
  const history = useHistory();

  let topicToDelete = props.displayedTopic;
  function toggleState() {
    setKeepChildrenTopics((prevState) => !prevState);
  }
  const userLoggedIn = (
    <>
      {" "}
      <h2>
        Delete topic:{" "}
        {props.displayedTopic && `"${props.displayedTopic.title}"?`}
      </h2>
      {props.displayedTopic.children &&
      props.displayedTopic.children.length !== 0 ? (
        <>
          <label>
            {" "}
            Keep children topics
            <input type="checkbox" onChange={toggleState}></input>
          </label>
          <br />
        </>
      ) : (
        ""
      )}
      <button className="btn btn-yes-no" onClick={handleSubmit}>
        Yes
      </button>
      <button className="btn btn-yes-no btn-gray" onClick={closeModal}>
        No
      </button>
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
    let parameters = props.displayedTopic;
    if (keepChildrenTopics) parameters.keepChildrenTopics = true;
    props
      .deleteCurrentTopic(parameters)
      .then(props.triggerUpdate())
      .then(history.push("/"))
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
