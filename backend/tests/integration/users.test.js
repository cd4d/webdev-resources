require("dotenv").config();

let supertestRequest = require("supertest");
const mongoose = require("mongoose");

const { Topic } = require("../../models/topics-model");
const { Link } = require("../../models/links-model");

let server;

describe("/api/users/", () => {
  let id;
  let secondTopicId;
  let linkIdOne;
  let linkIdTwo;
  let userIdOne;
  let userIdTwo;

  const createTopics = async (user = null) => {
    const topic = new Topic({
      _id: id,
      title: "Test Topic",
      user: user,
      links: [
        {
          _id: linkIdOne,
          description: "some description",
          url: "http://example.com",
        },
        {
          _id: linkIdTwo,
          description: "another description",
          url: "http://example2.com",
        },
      ],
    });
    await topic.save();
    const secondTopic = new Topic({
      _id: secondTopicId,
      title: "Second Test Topic",
    });
    await secondTopic.save();
  };

  beforeEach(async () => {
    server = require("../../index");
    id = new mongoose.Types.ObjectId();
    secondTopicId = new mongoose.Types.ObjectId();
    linkIdOne = new mongoose.Types.ObjectId();
    linkIdTwo = new mongoose.Types.ObjectId();
    userIdOne = new mongoose.Types.ObjectId();
    userIdTwo = new mongoose.Types.ObjectId();
  });

  afterEach(async () => {
    await Topic.collection.deleteMany();
    await server.close();
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });
});
