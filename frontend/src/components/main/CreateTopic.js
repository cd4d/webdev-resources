import React, { useState } from "react";
import Modal from "react-modal";
import { v4 as uuidv4 } from "uuid";
import { useHistory } from "react-router-dom";

import "./modal.css";

Modal.setAppElement("#root");

export default function CreateTopic(props) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [newTopic, setNewTopic] = useState();
  // useHistory from react-router for redirection
  const history = useHistory();

  function openModal() {
    setIsOpen(true);
    props.flushAppError();
  }
  function closeModal() {
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
    if (name === "topics-list") {
      setNewTopic((prevState) => {
        return { ...prevState, parent: value };
      });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    // don't send a request if fields are blank
    if (!newTopic) {
      return closeModal();
    }
    console.log("topic to add: ", newTopic);
    if (props.user) {
      const response = await props.handleCreateTopic(newTopic);
      if (response.status >= 400) {
        props.handleError(response);
        closeModal();
      } else {
        props.triggerUpdate();
        newTopic.slug && history.push("/topics/" + newTopic.slug);
        closeModal();
      }
    } else {
      const localResponse = await props.handleCreateTopic(newTopic);

      if (localResponse.status) {
        props.handleError(localResponse);
        closeModal();
      } else {
        props.triggerUpdate();
        newTopic.slug && history.push("/topics/" + newTopic.slug);

        closeModal();
      }
    }
  }
  const createTopicContent = (
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
          {props.topics && props.topics.length > 1 && (
            <li>
              <label htmlFor="create-topic-topics-list" className="label-form">
                Child of{" "}
              </label>{" "}
              <select
                className="input-form"
                name="topics-list"
                id="create-topic-topics-list"
                onChange={handleChange}
                // https://stackoverflow.com/questions/44786669/warning-use-the-defaultvalue-or-value-props-on-select-instead-of-setting
                value={newTopic && newTopic.parent ? newTopic.parent : ""}
              >
                <option value="">None</option>
                {props.topics
                  .filter((topic) => topic.depth === 0)
                  .map((topic) => (
                    <option key={uuidv4()} value={topic._id}>
                      {topic.title}
                    </option>
                  ))}
              </select>
            </li>
          )}
        </ul>

        <button>Create topic</button>
      </form>
    </>
  );

  return (
    <>
      <span className="btn btn-create-topic" onClick={openModal}>
        Create Topic
      </span>
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
        {createTopicContent}
      </Modal>
    </>
  );
}
