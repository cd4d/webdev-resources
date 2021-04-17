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
  const [isLoading, setIsLoading] = useState(false);

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
            <label htmlFor="add-link-summary" className="label-form  required">
              Summary
            </label>
            <input
              className="input-form"
              id="add-link-summary"
              name="summary"
              type="text"
              maxLength="50"
              placeholder="50 characters max."
              onChange={handleChange}
              required
            />
          </li>
        </ul>

        <br />
        {errorMsg && <p className="error-msg">{errorMsg}</p>}
        {isLoading && <p>Loading link preview...</p>}
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
    setIsLoading(false);
    setIsOpen(false);
  }

  async function handleSubmit(e) {
    setIsLoading(true);
    e.preventDefault();
    // don't send a request if fields are blank
    if (!newLink) {
      return closeModal();
    }
    // append links at end of existing links array

    // check if link already exists
    if (
      existingLinks.some(
        (link) => link.summary === newLink.summary || link.url === newLink.url
      )
    ) {
      //console.log("existing url in same topic");
      setErrorMsg("URL or summary already in this topic.");
      setIsLoading(false);
      return null;
    }
    // else console.log("displayed topic: ", props.displayedTopic);
    if (props.user) {
      const response = await props.handleCreateLink({
        topic: props.displayedTopic,
        ...newLink,
      });
      if (response.status !== 200) {
        props.handleError(response);
        closeModal();
      } else {
        props.triggerUpdate();
      }
    } else {
      const response = await props.handleCreateLink(
        {
          topic: props.displayedTopic,
          ...newLink,
        },
        "createLink"
      );
    }
    props.triggerUpdate();

    closeModal();
  }

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === "url") {
      setNewLink((prevState) => {
        return { ...prevState, url: value };
      });
    }
    if (name === "summary") {
      setNewLink((prevState) => {
        return { ...prevState, summary: value };
      });
    }
  }

  return (
    <>
      <button className="btn btn-add-link" onClick={openModal}>
        Add link
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        className="Modal  addTopicModal"
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
