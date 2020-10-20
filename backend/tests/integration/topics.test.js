require("dotenv").config();

let supertestRequest = require("supertest");
const mongoose = require("mongoose");

const { Topic } = require("../../models/topics-model");

let server;

describe("api/topics", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await Topic.collection.deleteMany();
    await server.close();
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("GET /", () => {
    test("should return all topics", async () => {
      const topic = new Topic({ title: "Test Topic" });
      await topic.save();
      const res = await supertestRequest(server).get("/api/topics/");
      expect(res.status).toBe(200);
      expect(res.body[0]).toHaveProperty("title");
      expect(res.body[0].title).toBe("Test Topic");
      expect(res.body[0]).toHaveProperty("slug");
      expect(res.body[0].slug).toBe("test-topic");
    });
  });

  describe("POST /", () => {
    let title = "";
    let links = undefined;
    let description = undefined;
    const execRequest = async () => {
      return await supertestRequest(server)
        .post("/api/topics/")
        .send({ title: title, links: links, description: description });
    };
    beforeEach(() => {
      title = "validTitle";
      links = [
        { description: "some description", url: "http://example.com" },
        { description: "another description", url: "http://example2.com" },
      ];
      description = "Some description";
    });
    test("should return 201  from express-validator if title input  properly formatted", async () => {
      links = undefined;
      description = undefined;
      const res = await execRequest();
      expect(res.status).toBe(201);
      expect(res.body.title).toBe("validTitle");
    });

    test("should return 201  from express-validator if title, links input properly formatted", async () => {
      description = undefined;
      const res = await execRequest();
      expect(res.status).toBe(201);
      expect(res.body.title).toBe("validTitle");
      expect(res.body.links[0]).toHaveProperty(
        "description",
        "some description"
      );
      expect(res.body.links[0]).toHaveProperty("url", "http://example.com");
      expect(res.body.links[1]).toHaveProperty(
        "description",
        "another description"
      );
      expect(res.body.links[1]).toHaveProperty("url", "http://example2.com");
    });
    test("should return 201  from express-validator if title, links, description input properly formatted", async () => {
      const res = await execRequest();
      expect(res.status).toBe(201);
      expect(res.body.title).toBe("validTitle");
      expect(res.body.links[0]).toHaveProperty(
        "description",
        "some description"
      );
      expect(res.body.links[0]).toHaveProperty("url", "http://example.com");
      expect(res.body.description).toBe("Some description");
    });
    test("should return 500 error from express-validator if title input not properly formatted", async () => {
      title = {};
      const res = await execRequest();
      expect(res.status).toBe(500);
    });

    test("should return 422 error from express-validator if title input too short", async () => {
      title = "o";
      const res = await execRequest();
      expect(res.status).toBe(422);
    });
    test("should return 422 error from express-validator if description input not properly formatted", async () => {
      description = [];
      const res = await execRequest();
      expect(res.status).toBe(422);
    });
    test("should return 422 error from express-validator if description input too short", async () => {
      description = "o";
      const res = await execRequest();
      expect(res.status).toBe(422);
    });

    test("should return 422 error from express-validator if link url is not  url", async () => {
      links = [{ description: "some description", url: "noturl" }];
      const res = await execRequest();
      expect(res.status).toBe(422);
    });
    test("should return 422 error from express-validator if link url is missing protocol (http,https)", async () => {
      links = [{ description: "some description", url: "wrongurl.com" }];
      const res = await execRequest();
      expect(res.status).toBe(422);
    });
    test("should return 422 error from express-validator if another link url  not properly formatted", async () => {
      links = [
        { description: "some description", url: "example.com" },
        { description: "another description", url: "wrongurl" },
      ];
      const res = await execRequest();
      expect(res.status).toBe(422);
    });

    test("should fill ancestor and parent", async () => {
      links = undefined;
      description = undefined;
      const res = await execRequest();
      expect(res.status).toBe(201);
      expect(res.body.title).toBe("validTitle");
    });
  });

  describe("PATCH /:id", () => {
    const id = new mongoose.Types.ObjectId();
    beforeEach(async () => {
      const newTopic = new Topic({
        _id: id,
        title: "Some topic to patch",
        description: "Some description",
        links: [],
      });
      await newTopic.save();
    });
    test("Should return 200, updated slug for correctly formatted title update request", async () => {
      const res = await supertestRequest(server)
        .patch("/api/topics/" + id)
        .send({ title: "Changed topic" });
      const changedTopic = await Topic.findById(id).exec();
      expect(res.status).toBe(200);
      expect(changedTopic.title).toBe("Changed topic");
      expect(changedTopic.slug).toBe("changed-topic");
    });

    test("Should return 200, updated slug and description for correctly formatted title update request", async () => {
      const res = await supertestRequest(server)
        .patch("/api/topics/" + id)
        .send({ description: "Changed description" });
      const changedTopic = await Topic.findById(id).exec();
      expect(res.status).toBe(200);
      expect(changedTopic.description).toBe("Changed description");
      expect(changedTopic.slug).toBe("some-topic-to-patch");
    });
    test("Should return 200, updated slug and new link for correctly formatted title update request", async () => {
      const res = await supertestRequest(server)
        .patch("/api/topics/" + id)
        .send({
          title: "Changed topic",
          links: [{ description: "web dev", url: "http://example.com" }],
        });
      const changedTopic = await Topic.findById(id).exec();
      expect(res.status).toBe(200);
      expect(changedTopic.title).toBe("Changed topic");
      expect(changedTopic.slug).toBe("changed-topic");
      // https://medium.com/@andrei.pfeiffer/jest-matching-objects-in-array-50fe2f4d6b98
      expect(changedTopic.links).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            description: "web dev",
            url: "http://example.com",
          }),
        ])
      );
    });
    test("Should return error,  for incorrectly formatted link update request", async () => {
      const res = await supertestRequest(server)
        .patch("/api/topics/" + id)
        .send({
          title: "Changed topic",
          links: [{ description: "web dev", url: "examplecom" }],
        });
      const changedTopic = await Topic.findById(id).exec();
      expect(res.status).toBe(400);
    });
    test("Should return 400, for incorrectly formatted title", async () => {
      const res = await supertestRequest(server)
        .patch("/api/topics/" + id)
        .send({ title: {} });
      expect(res.status).toBe(400);
    });
  });

  describe("DELETE /:id", () => {
    const id = new mongoose.Types.ObjectId();
    beforeEach(async () => {
      const newTopic = new Topic({
        _id: id,
        title: "Some topic to delete",
        description: "Some description",
        links: [],
      });
      await newTopic.save();
    });
    test("should remove the selected topic", async () => {
      const res = await supertestRequest(server).delete("/api/topics/" + id);
      expect(res.status).toBe(200);
      const deletedDoc = await Topic.findById(id);
      expect(deletedDoc).toBe(null);
    });
  });
});
