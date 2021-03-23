import React, { useState } from "react";
import Modal from "react-modal";
import "./modal.css";
Modal.setAppElement("#root");

export default function CreateTopic(props) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [newTopic, setNewTopic] = useState();
  function openModal() {
    props.flushError();
    setIsOpen(true);
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

    const response = await props.createNewTopic(newTopic);
    props.triggerUpdate();
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
  return (
    <>
      <button onClick={openModal}>Create Topic</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        className="Modal addTopicModal"
      >
        <button onClick={closeModal} id="button-close-modal">
          close
        </button>
        <h2>Create topic</h2>
        <form onSubmit={handleSubmit}>
          <label className="required">
            Title
            <input name="title" type="text" onChange={handleChange} required />
          </label>
          <br />
          <label className="required">
            Description
            <input
              name="description"
              type="text"
              onChange={handleChange}
              required
            />
          </label>

          <br />
          <button>Create topic</button>
        </form>
      </Modal>
    </>
  );
}
