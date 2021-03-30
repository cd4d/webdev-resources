import React, { useState } from "react";
import Modal from "react-modal";
import "./modal.css";
Modal.setAppElement("#root");

export default function EditTopic(props) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [editedTopic, setEditedTopic] = useState(null);
  const userLoggedIn = (
    <>
      <h2>
        Edit topic: {props.displayedTopic && `"${props.displayedTopic.title}"`}
      </h2>
      <form onSubmit={handleSubmit}>
        <ul>
          <li>
            <label htmlFor="edit-topic-title" className="label-form">
              Title
            </label>
            <input
              id="edit-topic-title"
              className="input-form"
              name="title"
              type="text"
              onChange={handleChange}
            />
          </li>
          <li>
            <label htmlFor="edit-topic-description" className="label-form ">
              Description
            </label>
            <input
              id="edit-topic-description"
              className="input-form"
              name="description"
              type="text"
              onChange={handleChange}
            />
          </li>
        </ul>

        <button>Edit topic</button>
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

  async function handleSubmit(e) {
    e.preventDefault();
    // don't send a request if fields are blank
    if (!editedTopic) {
      return closeModal();
    }
    console.log("topic to edit: ", editedTopic);

    const response = await props
      .editDisplayedTopic(props.displayedTopic._id, editedTopic, "editTopic")
      .then(closeModal());
  }

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === "title") {
      setEditedTopic((prevState) => {
        return { ...prevState, title: value };
      });
    }
    if (name === "description") {
      setEditedTopic((prevState) => {
        return { ...prevState, description: value };
      });
    }
  }
  return (
    <>
      <button className="btn btn-edit-topic" onClick={openModal}>
        Edit Topic
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        className="Modal addTopicModal"
      >
        <button onClick={closeModal} id="button-close-modal">
          close
        </button>

        {props.user ? userLoggedIn : props.noUserLoggedIn}
      </Modal>
    </>
  );
}
