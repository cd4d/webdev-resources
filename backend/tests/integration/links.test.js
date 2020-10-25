require("dotenv").config();

let supertestRequest = require("supertest");
const mongoose = require("mongoose");

const { Topic } = require("../../models/topics-model");

let server;

describe("/api/links/", () => {
  let id;
  let secondTopicId;
  let linkIdOne;
  let linkIdTwo;
  beforeEach(async () => {
    server = require("../../index");
    id = new mongoose.Types.ObjectId();
    secondTopicId = new mongoose.Types.ObjectId();
    linkIdOne = new mongoose.Types.ObjectId();
    linkIdTwo = new mongoose.Types.ObjectId();
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
      links: [],
    });
    await secondTopic.save();
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
  });

  describe("GET /:id", () => {
    test("should return requested link", async () => {
      const res = await supertestRequest(server).get(
        "/api/links/link/" + linkIdOne
      );
      expect(res.status).toBe(200);
      expect(res.body.description).toBe("some description");
      expect(res.body.url).toBe("http://example.com");
    });
  });

  describe("PATCH /:id", () => {
    beforeEach(async () => {});
    test("should successfully update requested link with both fields", async () => {
      //   const res2 = await supertestRequest(server).get("/api/links/" + linkIdOne)
      const res = await supertestRequest(server)
        .patch("/api/links/link/" + linkIdOne)
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
      //   const res2 = await supertestRequest(server).get("/api/links/" + linkIdOne)
      const res = await supertestRequest(server)
        .patch("/api/links/link/" + linkIdOne)
        .send({ description: "moved link", topic: secondTopicId });
      // console.log(res.text);

      expect(res.status).toBe(200);
      const firstTopicAfterReq = await Topic.find({ _id: id });
      const secondTopicAfterReq = await Topic.find({ _id: secondTopicId });
      console.log("firstTopicAfterReq", firstTopicAfterReq[0]);
      console.log("secondTopicAfterReq", secondTopicAfterReq[0]);
    });

    test("should successfully update requested link with just description changed", async () => {
      //   const res2 = await supertestRequest(server).get("/api/links/" + linkIdOne)
      const res = await supertestRequest(server)
        .patch("/api/links/link/" + linkIdOne)
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
        .patch("/api/links/link/" + linkIdOne)
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

    test("should reject update requested link with malformatted url supplied", async () => {
      //   const res2 = await supertestRequest(server).get("/api/links/" + linkIdOne)
      const res = await supertestRequest(server)
        .patch("/api/links/link/" + linkIdOne)
        .send({ url: "changed-example" });
      const newLink = await Topic.find({ "links._id": linkIdOne });
      // console.log(newLink[0].links);
      expect(res.status).toBe(422);
    });
    test("should reject update requested link with empty values supplied", async () => {
      //   const res2 = await supertestRequest(server).get("/api/links/" + linkIdOne)
      const res = await supertestRequest(server)
        .patch("/api/links/link/" + linkIdOne)
        .send({ description: "", url: "" });
      const newLink = await Topic.find({ "links._id": linkIdOne });
      // console.log(newLink[0].links);
      expect(res.status).toBe(422);
    });
  });
});
