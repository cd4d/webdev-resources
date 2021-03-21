import React, { useState } from "react";
import Modal from "react-modal";
import "./modal.css";
Modal.setAppElement("#root");

export default function EditTopic(props) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [topic, setTopic] = useState({
    title: props.displayedTopic.title,
    description: props.displayedTopic.description,
    slug: props.displayedTopic.slug,
  });
  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log("topics submitted: ", topic);
    const response = props.editDisplayedTopic(topic, null);
    props.triggerUpdate();
    setIsOpen(false);
  }
  function handleChange(e) {
    const { name, value } = e.target;
    if (name === "title") {
      setTopic((prevState) => {
        return { ...prevState, title: value };
      });
    }
    if (name === "description") {
      setTopic((prevState) => {
        return { ...prevState, description: value };
      });
    }
  }
  return (
    <>
      <button onClick={openModal}>Edit Topic</button>
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
          <button>Edit topic</button>
        </form>
      </Modal>
    </>
  );
}
