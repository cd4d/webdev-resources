if (process.env.NODE_ENV !== "production") require("dotenv").config();
let supertestRequest = require("supertest");
const mongoose = require("mongoose");

const { Topic } = require("../../models/topics-model");
const { Link } = require("../../models/links-model");

let server;



describe("/api/links/", () => {
  let id;
  let secondTopicId;
  let linkIdOne;
  let linkIdTwo;

  const createTopics = async () => {
    const topic = new Topic({
      _id: id,
      title: "Test Topic",
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
  }


  beforeEach(async () => {
    server = require("../../index");
    id = new mongoose.Types.ObjectId();
    secondTopicId = new mongoose.Types.ObjectId();
    linkIdOne = new mongoose.Types.ObjectId();
    linkIdTwo = new mongoose.Types.ObjectId();
    
  });

  afterEach(async () => {
    await Topic.collection.deleteMany();
    await server.close();
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("GET /", () => {
    test("should return all links", async () => {

     await createTopics()

      const res = await supertestRequest(server).get("/api/links/");
      expect(res.body[0].links).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            description: "some description",
            url: "http://example.com",
            description: "another description",
            url: "http://example2.com",
          }),
        ])
      );
    });
    test("should return 404 error if no links", async () => {
      const res = await supertestRequest(server).get("/api/links/");
      expect(res.status).toBe(404);
    });
  });

  describe("GET /topic/:topicid", () => {
    test("should return all links from one topic", async () => {

      await createTopics()
      
      const res = await supertestRequest(server).get("/api/links/topic/" + id);
      expect(res.status).toBe(200)
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            description: "some description",
            url: "http://example.com",
            description: "another description",
            url: "http://example2.com",
          }),
        ])
      );
    });
    test("should return 400 error for malformed topic id", async () => {
      const res = await supertestRequest(server).get(
        "/api/links/topic/" + "wrongId"
      );
      expect(res.status).toBe(400);
    });
    test("should return 404 error for non existing topic id", async () => { createTopics()
      const res = await supertestRequest(server).get(
        "/api/links/topic/" + new mongoose.Types.ObjectId()
      );
      expect(res.status).toBe(404);
    });
  });

  describe("GET /link/:id", () => {
    test("should return requested link", async () => {

      await createTopics()

      const res = await supertestRequest(server).get(
        "/api/links/link/" + linkIdOne
      );
      expect(res.status).toBe(200);
      expect(res.body.description).toBe("some description");
      expect(res.body.url).toBe("http://example.com");
    });
    test("should return 404 error for non existing link", async () => { createTopics()
      const res = await supertestRequest(server).get(
        "/api/links/link/" + new mongoose.Types.ObjectId()
      );
      expect(res.status).toBe(404);
    });
    test("should return 400 error for malformed link", async () => { createTopics()
      const res = await supertestRequest(server).get(
        "/api/links/link/" + "wrongId"
      );
      expect(res.status).toBe(400);
    });
  });

  describe("PATCH /:id", () => {
    beforeEach(async () => { createTopics()});
    test("should successfully update requested link with both fields", async () => {

      const res = await supertestRequest(server)
        .patch("/api/links/" + linkIdOne)
        .send({
          description: "changed link description",
          url: "http://changed-example.com",
        });
      expect(res.status).toBe(200);

      const newLink = await Topic.find({ "links._id": linkIdOne });
      //console.log(newLink[0].links);
      expect(newLink[0].links).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            description: "changed link description",
            url: "http://changed-example.com",
          }),
        ])
      );
    });

    test("should successfully move requested link with parent topic changed", async () => {

      const res = await supertestRequest(server)
        .patch("/api/links/" + linkIdOne)
        .send({
          description: "moved link",
          url: "http://moved-topic.com",
          topic: secondTopicId,
        });
      // console.log(res.text);

      expect(res.status).toBe(200);
      const firstTopicAfterReq = await Topic.find({ _id: id });
      const secondTopicAfterReq = await Topic.find({ _id: secondTopicId });
      // console.log("firstTopicAfterReq", firstTopicAfterReq[0]);
      // console.log("secondTopicAfterReq", secondTopicAfterReq[0]);
      expect(firstTopicAfterReq[0].links[0]).toEqual(
        expect.not.objectContaining({
          description: "moved link",
          url: "http://moved-topic.com",
        })
      );
      expect(secondTopicAfterReq[0].links[0]).toEqual(
        expect.objectContaining({
          description: "moved link",
          url: "http://moved-topic.com",
        })
      );
    });

    test("should successfully update requested link with just description changed", async () => {
      //   const res2 = await supertestRequest(server).get("/api/links/" + linkIdOne)
      const res = await supertestRequest(server)
        .patch("/api/links/" + linkIdOne)
        .send({ description: "changed link description" });
      //   console.log(res.text);

      expect(res.status).toBe(200);
      const newLink = await Topic.find({ "links._id": linkIdOne });
      expect(newLink[0].links[0]).toEqual(
        expect.objectContaining({
          description: "changed link description",
          url: "http://example.com",
        })
      );
    });
    test("should successfully update requested link with just url changed", async () => {
      //   const res2 = await supertestRequest(server).get("/api/links/" + linkIdOne)
      const res = await supertestRequest(server)
        .patch("/api/links/" + linkIdOne)
        .send({ url: "http://changed-example.com" });
      // console.log(res.text);

      expect(res.status).toBe(200);

      const newLink = await Topic.find({ "links._id": linkIdOne });
      //console.log(newLink[0].links);

      expect(newLink[0].links[0]).toEqual(
        expect.objectContaining({
          description: "some description",
          url: "http://changed-example.com",
        })
      );
    });

    test("should reject update requested link with wrong id - 404 error - ", async () => {
      const wrongId = new mongoose.Types.ObjectId()
      const res = await supertestRequest(server)
        .patch("/api/links/" + wrongId)
        .send({ url: "http://changed-example.com" });
      expect(res.status).toBe(404);
    });

    test("should reject update requested link with malformatted url supplied - 422 error - ", async () => {
      //   const res2 = await supertestRequest(server).get("/api/links/" + linkIdOne)
      const res = await supertestRequest(server)
        .patch("/api/links/" + linkIdOne)
        .send({ url: "changed-example" });
      const newLink = await Topic.find({ "links._id": linkIdOne });
      // console.log(newLink[0].links);
      expect(res.status).toBe(422);
    });

    test("should reject update requested link with empty values supplied - 422 error -", async () => {
      //   const res2 = await supertestRequest(server).get("/api/links/" + linkIdOne)
      const res = await supertestRequest(server)
        .patch("/api/links/" + linkIdOne)
        .send({ description: "", url: "" });
      const newLink = await Topic.find({ "links._id": linkIdOne });
      // console.log(newLink[0].links);
      expect(res.status).toBe(422);
    });
  });

  describe("POST /", () => {
    let linkId = new mongoose.Types.ObjectId();
    test("Should post a new link in  topic with other existing links", async () => {
      await createTopics()
      const newLink = {
        _id: linkId,
        description: "A new link",
        url: "http://anewlink.com",
        topic: id,
      };
      const res = await supertestRequest(server)
        .post("/api/links/")
        .send(newLink);
      expect(res.status).toBe(200);
      const updatedTopic = await Topic.findById(id);
      expect(updatedTopic.links).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            description: "A new link",
            url: "http://anewlink.com",
          }),
        ])
      );
    });
    test("Should post a new link in  topic with no previous links", async () => {
      createTopics()
      const newLink = {
        _id: linkId,
        description: "A new link",
        url: "http://anewlink.com",
        topic: secondTopicId,
      };
      const res = await supertestRequest(server)
        .post("/api/links/")
        .send(newLink);
      expect(res.status).toBe(200);
      const updatedTopic = await Topic.findById(secondTopicId);
      expect(updatedTopic.links).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            description: "A new link",
            url: "http://anewlink.com",
          }),
        ])
      );
    });
    test("Should return 422 error for posting in topic with malformed id", async () => {
      const newLink = {
        _id: linkId,
        description: "A new link",
        url: "http://anewlink.com",
        topic: "wrongId",
      };
      const res = await supertestRequest(server)
        .post("/api/links/")
        .send(newLink);
      expect(res.status).toBe(422);
    });
    test("Should return 404 error for posting in topic with non existing id", async () => {
      const newLink = {
        _id: linkId,
        description: "A new link",
        url: "http://anewlink.com",
        topic: new mongoose.Types.ObjectId(),
      };
      const res = await supertestRequest(server)
        .post("/api/links/")
        .send(newLink);
      expect(res.status).toBe(404);
    });
    test("Should return 422 error for posting in topic with malformed link url", async () => {
      const newLink = {
        _id: linkId,
        description: "A new link",
        url: "anewlink.com",
        topic: new mongoose.Types.ObjectId(),
      };
      const res = await supertestRequest(server)
        .post("/api/links/")
        .send(newLink);
      expect(res.status).toBe(422);
    });
    test("Should return 422 error for posting in topic without description", async () => {
      const newLink = {
        _id: linkId,

        url: "http://anewlink.com",
        topic: new mongoose.Types.ObjectId(),
      };
      const res = await supertestRequest(server)
        .post("/api/links/")
        .send(newLink);
      expect(res.status).toBe(422);
    });
  });
});
