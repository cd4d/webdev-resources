// TODO welcome screen
import React, { useState } from "react";
import Modal from "react-modal";
import "./welcome-screen.css";
Modal.setAppElement("#root");

export default function WelcomeScreen(props) {
  const [modalIsOpen, setIsOpen] = useState(true);

  function closeModal() {
    props.setIsLoading(false);
    setIsOpen(false);
  }

  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        className="Modal welcome-screen-modal  addTopicModal"
      >
        <h2>Simple Link bookmark</h2>
        <p>
          A react app to bookmark links by topics with Open Graph generated
          preview.{" "}
        </p>
        <p>
          Save, delete, edit links and topics. 
        </p>
        <p>Uses MongoDB, Express, Node and React (MERN stack).</p>
        <button onClick={closeModal}>close</button>
      </Modal>
    </>
  );
}
