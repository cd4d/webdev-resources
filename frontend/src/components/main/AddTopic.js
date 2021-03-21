import React, { useState } from "react";
import Modal from "react-modal";
import "./modal.css";
Modal.setAppElement("#root");

export default function AddTopic(props) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [newTopic, setNewTopic] = useState({ title: "", description: "" });
  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  function handleSubmit(e) {
    e.preventDefault();

    const response = props.addNewTopic(newTopic);
    props.triggerUpdate();
    setIsOpen(false);
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
      <button onClick={openModal}>Add Topic</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        className="Modal addTopicModal"
      >
        <button onClick={closeModal} id="button-close-modal">
          close
        </button>
        <h2>Hello</h2>
        <div>I am a modal</div>
        <form onSubmit={handleSubmit}>
          <label>
            Title
            <input name="title" type="text" onChange={handleChange} />
          </label>
          <br />
          <label>
            Description
            <input name="description" type="text" onChange={handleChange} />
          </label>

          <br />
          <button>Add topic</button>
        </form>
      </Modal>
    </>
  );
}
