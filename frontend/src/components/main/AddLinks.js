import React, { useState } from "react";
import Modal from "react-modal";
import "./modal.css";
import "./main.css";
Modal.setAppElement("#root");

export default function AddLinks(props) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const existingLinks = props.displayedTopic.links;
  const [newLink, setNewLink] = useState();
  const [errorMsg, setErrorMsg] = useState(null);
  const userLoggedIn = (
    <>
      <h2>Add link</h2>
      <form onSubmit={handleSubmit}>
        <ul>
          <li>
            {" "}
            <label htmlFor="url" className="label-form required">
              Url
            </label>
            <input
              className="input-form"
              name="url"
              id="url"
              type="URL"
              onChange={handleChange}
              placeholder="Must start with http(s)"
              required
            />
          </li>
          <li>
            {" "}
            <label htmlFor="add-link-description" className="label-form  required">
              Description
            </label>
            <input
              className="input-form"
              id="add-link-description"
              name="description"
              type="text"
              onChange={handleChange}
              required
            />
          </li>
        </ul>

        <br />
        {errorMsg && <p className="error-msg">{errorMsg}</p>}

        <button>Submit link</button>
      </form>
    </>
  );
  function openModal() {
    setIsOpen(true);
    props.flushAppError();
  }
  function closeModal() {
    setErrorMsg(null);
    setIsOpen(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    // don't send a request if fields are blank
    if (!newLink) {
      return closeModal();
    }
    // append links at end of existing links array
    console.log("existingLinks: ", existingLinks);
    console.log("newLink: ", newLink);
    // check if link already exists
    if (
      existingLinks.some(
        (link) =>
          link.description === newLink.description || link.url === newLink.url
      )
    ) {
      console.log("existing url in same topic");
      setErrorMsg("URL or description already in this topic.");
      return null;
    } else console.log("displayed topic: ", props.displayedTopic);
    const response = await props
      .editDisplayedTopic(props.displayedTopic, newLink, "addLink")
      .catch((err) => {
        console.log("error: ", err);
        return err;
      });
  }

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === "url") {
      setNewLink((prevState) => {
        return { ...prevState, url: value };
      });
    }
    if (name === "description") {
      setNewLink((prevState) => {
        return { ...prevState, description: value };
      });
    }
  }

  return (
    <>
      <button onClick={openModal}>Add link</button>
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
