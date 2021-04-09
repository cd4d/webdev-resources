import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./modal.css";
Modal.setAppElement("#root");

export default function EditLink(props) {
  //console.log(props);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [editedLink, setEditedLink] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  function editLink() {
    openModal();

    props.triggerUpdate();
  }
  function handleChange(e) {
    const { name, value } = e.target;
    if (name === "url") {
      setEditedLink((prevState) => {
        return { ...prevState, url: value };
      });
    }
    if (name === "summary") {
      setEditedLink((prevState) => {
        return { ...prevState, summary: value };
      });
    }
  }
  async function handleSubmit(e) {
    setIsLoading(true);

    e.preventDefault();
    // don't send a request if fields are blank
    if (!editedLink) {
      return closeModal();
    }
    console.log("topic to edit: ", editedLink);
    if (props.user) {
      const response = await props.editCurrentLink(
        props.currentLink._id,
        editedLink
      );
    } else {
      props.editCurrentLink(
        {
          topic: props.displayedTopic,
          linkId: props.currentLink._id,
          newData: editedLink,
        },
        "editLink"
      );
    }
    setIsLoading(false);
  }

  return (
    <>
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
        <h2>
          Edit link: {props.currentLink && `"${props.currentLink.summary}"`}
        </h2>
        <form onSubmit={handleSubmit}>
          <ul>
            <li>
              <label htmlFor="edit-topic-title" className="label-form">
                URL
              </label>
              <input
                id="edit-link-url"
                className="input-form"
                name="url"
                type="text"
                maxLength="40"
                placeholder="40 characters max."
                onChange={handleChange}
              />
            </li>
            <li>
              <label htmlFor="edit-topic-description" className="label-form ">
                Summary
              </label>
              <input
                id="edit-link-summary"
                className="input-form"
                name="summary"
                maxLength="50"
                placeholder="50 characters max."
                type="text"
                onChange={handleChange}
              />
            </li>
          </ul>
          {isLoading && <p>Loading...</p>}
          <button>Submit</button>
        </form>{" "}
      </Modal>{" "}
      <span className="gg-pen" title="Edit link" onClick={openModal}></span>
    </>
  );
}
