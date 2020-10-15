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
      const topic = new Topic({ title: "TestTopic" });
      await topic.save();
      const res = await supertestRequest(server).get("/api/topics/");
      expect(res.status).toBe(200);
      expect(res.body[0]).toHaveProperty("title");
      expect(res.body[0].title).toBe("TestTopic");
    });
  });

  describe("POST /", () => {
    let title = "";
    let links = undefined
    let description = undefined;
    const execRequest = async () => {
      return await supertestRequest(server)
        .post("/api/topics/")
        .send({ title: title, links: links, description: description });
    };
    beforeEach(() => {
      title = "validTitle";
      links = [{"description":"some description","url":"http://example.com"}]
      description = "Some description"

    });
    test("should return 201  from joi if title input  properly formatted", async () => {
      links = undefined
      description = undefined;
      const res = await execRequest();
      expect(res.status).toBe(201);
      expect(res.body.title).toBe("validTitle")
    });

    test("should return 201  from joi if title, links input properly formatted", async () => {
      description = undefined;
      const res = await execRequest();
      expect(res.status).toBe(201);
      expect(res.body.title).toBe("validTitle")
      expect(res.body.links[0]).toHaveProperty("description","some description")
      expect(res.body.links[0]).toHaveProperty("url","http://example.com")

    });
    test("should return 201  from joi if title, links, description input properly formatted", async () => {
      
      const res = await execRequest();
      expect(res.status).toBe(201);
      expect(res.body.title).toBe("validTitle")
      expect(res.body.links[0]).toHaveProperty("description","some description")
      expect(res.body.links[0]).toHaveProperty("url","http://example.com")
      expect(res.body.description).toBe("Some description")
    });
    test("should return 500 error from joi if title input not properly formatted", async () => {
      title = {};
      const res = await execRequest();
      expect(res.status).toBe(500);
    });

    test("should return 500 error from joi if description input not properly formatted", async () => {
      description = [];
      const res = await execRequest();
      expect(res.status).toBe(500);
    });
  });
});
