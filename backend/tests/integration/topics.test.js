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
    let links = [];
    let description = undefined;
    const execRequest = async () => {
      return await supertestRequest(server)
        .post("/api/topics/")
        .send({ title: title, links: links, description: description });
    };
    beforeEach(() => {
      title = "validTitle";
    });
    test("should return 201  from joi if title input  properly formatted", async () => {
      const res = await execRequest();
      expect(res.status).toBe(201);
      expect(res.body.title).toBe("validTitle")
    });
    test("should return 500 error from joi if title input not properly formatted", async () => {
      title = {};
      const res = await execRequest();
      expect(res.status).toBe(500);
    });
    test("should return 201  from joi if title, links input properly formatted", async () => {
      links = ["link1", "link2"];
      const res = await execRequest();
      expect(res.status).toBe(201);
      expect(res.body.title).toBe("validTitle")
      expect(res.body.links).toContain("link1", "link2")

    });
  });
});
