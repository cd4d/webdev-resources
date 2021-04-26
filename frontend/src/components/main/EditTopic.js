import React, { useState } from "react";
import Modal from "react-modal";
import { v4 as uuidv4 } from "uuid";
import slugify from "../../utils/utils";
import { useHistory } from "react-router-dom";

import "./modal.css";
Modal.setAppElement("#root");

export default function EditTopic(props) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [editedTopic, setEditedTopic] = useState(null);
  const history = useHistory();

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === "title") {
      setEditedTopic((prevState) => {
        return { ...prevState, title: value };
      });
    }
    if (name === "description") {
      setEditedTopic((prevState) => {
        return { ...prevState, description: value };
      });
    }
    if (name === "topics-list") {
      setEditedTopic((prevState) => {
        return { ...prevState, parent: value };
      });
    }
  }
  const userLoggedIn = (
    <>
      <h2>
        Edit topic: {props.displayedTopic && `"${props.displayedTopic.title}"`}
      </h2>
      <form onSubmit={handleSubmit}>
        <ul>
          <li>
            <label htmlFor="edit-topic-title" className="label-form">
              Title
            </label>
            <input
              id="edit-topic-title"
              className="input-form"
              name="title"
              type="text"
              maxLength="40"
              placeholder="40 characters max."
              onChange={handleChange}
            />
          </li>
          <li>
            <label htmlFor="edit-topic-description" className="label-form ">
              Description
            </label>
            <input
              id="edit-topic-description"
              className="input-form"
              name="description"
              maxLength="50"
              placeholder="50 characters max."
              type="text"
              onChange={handleChange}
            />
          </li>

          <li>
            <label htmlFor="create-topic-topics-list" className="label-form">
              Child of{" "}
            </label>{" "}
            <select
              className="input-form"
              name="topics-list"
              id="create-topic-topics-list"
              onChange={handleChange}
              //https://reactjs.org/docs/forms.html#the-select-tag
              value={
                editedTopic && editedTopic.parent ? editedTopic.parent : ""
              }
            >
              <option value="">None</option>
              {props.topics
                .filter(
                  //only main topics and not the topic itself as possible parent
                  (topic) =>
                    topic.depth === 0 &&
                    topic._id !== props.displayedTopic._id &&
                    topic._id !== props.displayedTopic.parent
                )
                .map((topic) => (
                  <option
                    key={uuidv4()}
                    value={topic._id}
                    // https://stackoverflow.com/questions/31163693/how-do-i-conditionally-add-attributes-to-react-components/35428331#comment83214168_35428331
                    // selected={
                    //   editedTopic &&
                    //   editedTopic.parent &&
                    //   topic._id === editedTopic.parent
                    //     ? true
                    //     : undefined
                    // }
                  >
                    {topic.title}
                  </option>
                ))}
            </select>
          </li>
        </ul>

        <button>Edit topic</button>
      </form>
    </>
  );
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
    if (!editedTopic) {
      return closeModal();
    }
    console.log("topic to edit: ", editedTopic);
    let newSlug = "";
    if (editedTopic.title) {
      newSlug = slugify(editedTopic.title);
      editedTopic.slug = newSlug;
    }
    if (props.user) {
      const response = await props.handleEditTopic(
        props.displayedTopic,
        editedTopic
      );
      if (response.status >= 400) {
        props.handleError(response);
        closeModal();
      } else {
        props.triggerUpdate();
        editedTopic.title && history.push("/topics/" + newSlug);
        closeModal();
      }
    } else {
      const localResponse = await props.handleEditTopic(
        props.displayedTopic,
        editedTopic
      );

      if (localResponse.status) {
        props.handleError(localResponse);
        closeModal();
      } else {
        props.triggerUpdate();
        editedTopic.title && history.push("/topics/" + newSlug);
        closeModal();
      }
    }
  }

  return (
    <>
      <button className="btn btn-edit-topic" onClick={openModal}>
        Edit Topic
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
