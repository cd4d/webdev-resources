import React, { useState } from "react";
import Modal from "react-modal";
import "./modal.css";
import "./main.css";
import linksReducer from "../../utils/utils";
Modal.setAppElement("#root");

export default function AddLinks(props) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const existingLinks = props.displayedTopic.links;
  const [newLink, setNewLink] = useState({ url: "", description: "" });
  const [errorMsg, setErrorMsg] = useState(null);

  function openModal() {
    props.flushError();
    setIsOpen(true);
  }
  function closeModal() {
    setErrorMsg(null);
    setIsOpen(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    let response;
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
    } else
      try {
        console.log("displayed topic: ", props.displayedTopic);
        response = await props.editDisplayedTopic(
          props.displayedTopic,
          newLink,
          "addLink"
        );
      } catch (err) {
        console.log("error: ", err);
        return err;
      }
    if (response) console.log(response);
    if (response && response.status === 409) {
      console.log("props error:", props.error);
    }
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
        <h2>Hello</h2>
        <div>I am a modal</div>
        <form onSubmit={handleSubmit}>
          <label className="required">
            Url
            <input
              name="url"
              type="URL"
              onChange={handleChange}
              placeholder="Must start with http(s)"
              required
            />
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
          {errorMsg && <p className="error-msg">{errorMsg}</p>}

          <button>Submit link</button>
        </form>
      </Modal>
    </>
  );
}
