import React, {useState} from "react";
import addTopic from "../../utils/frontendDB";
import Modal from "react-modal";
import "./modal.css";
Modal.setAppElement("#root");

export default (props) => {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }
  const [state, setState] = useState({
    topic: "",
    subTopic: "",
  });
  function handleSubmit(e)  {
    e.preventDefault();
    const { topic, subTopic } = state;
    addTopic(topic);
  };
  function handleChange(e) {
    setState({ topic: e.target.value });
  }
  return (
    <>
      <button onClick={openModal}>Open Modal</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
      >
        <button onClick={closeModal} id="button-close-modal">
          close
        </button>
        <h2>Hello</h2>
        <div>I am a modal</div>
        <form onSubmit={handleSubmit}>
          <label>
            Topic
            <input name="topicName" type="text" value={state.topic} onChange={handleChange}/>
          </label>
          <br />
          <label>
            SubTopic
            <input name="subTopicName" type="text" />
          </label>

          <br />
          <button>Add topic</button>
        </form>
      </Modal>
    </>
  );
};
