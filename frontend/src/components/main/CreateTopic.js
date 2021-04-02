import React, { useState } from "react";
import Modal from "react-modal";
import "./modal.css";
Modal.setAppElement("#root");

export default function CreateTopic(props) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [newTopic, setNewTopic] = useState();
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
    if (!newTopic) {
      return closeModal();
    }
    console.log("topic to add: ", newTopic);

    const response = props.createNewTopic(newTopic).then(closeModal());
    //props.triggerUpdate();
  }
  function handleChange(e) {
    const { name, value } = e.target;
    if (name === "title") {
      setNewTopic((prevState) => {
        return { ...prevState, title: value };
      });
    }
    if (name === "description") {
      setNewTopic((prevState) => {
        return { ...prevState, description: value };
      });
    }
  }

  const userLoggedIn = (
    <>
      <h2>Create topic</h2>
      <form onSubmit={handleSubmit}>
        <ul>
          <li>
            <label htmlFor="title" className="label-form required">
              Title
            </label>
            <input
              className="input-form"
              name="title"
              id="title"
              type="text"
              onChange={handleChange}
              maxLength="40"
              placeholder="40 characters max."
              required
            />
          </li>
          <li>
            <label
              htmlFor="create-topic-description"
              className="label-form required"
            >
              Description{" "}
            </label>{" "}
            <input
              className="input-form"
              name="description"
              id="create-topic-description"
              type="text"
              maxLength="50"
              placeholder="50 characters max."
              onChange={handleChange}
              required
            />
          </li>
        </ul>

        <button>Create topic</button>
      </form>
    </>
  );

  return (
    <>
      <button className="btn btn-create-topic" onClick={openModal}>
        Create Topic
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
        {/* {props.user ? userLoggedIn : props.noUserLoggedIn} */}
        {userLoggedIn}
      </Modal>
    </>
  );
}
