require("dotenv").config();

const mongoose = require("mongoose");
let supertestRequest = require("supertest");

const { Topic } = require("../../models/topics-model");
const { User } = require("../../models/users-model");
const session = require("supertest-session");
let server;
let testSession = null;
describe("/api/topics", () => {
  let id;
  let secondTopicId;
  let childTopicId;
  let userAdminId;
  let userId;
  const createUserAdmin = async () => {
    const registerUser = await User.register(
      {
        _id: userAdminId,
        isAdmin: true,
        username: "admin",
        email: "admin@test.com",
      },
      "123456"
    );
    const updateUser = await User.findOneAndUpdate(
      { _id: userAdminId },
      { isAdmin: true }
    );
  };

  const loginUserAdmin = async () => {
    const res = await testSession
      .post("/api/users/login")
      .set("Accept", "application/json")
      .send({ username: "admin", password: "123456" });
    //cookies = res.headers["set-cookie"].pop().split(";")[0];
    return testSession;
  };

  const createUser = async () => {
    const registerUser = await User.register(
      { _id: userId, username: "regularuser", email: "regularuser@test.com" },
      "123456"
    );
  };

  const loginUser = async () => {
    const res = await testSession
      .post("/api/users/login")
      .set("Accept", "application/json")
      .send({ username: "regularuser", password: "123456" });
    //cookies = res.headers["set-cookie"].pop().split(";")[0];
    return testSession;
  };

  const createTopics = async () => {
    const topic = new Topic({
      _id: id,
      title: "Test Topic",
      user: userId,
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
      user: userAdminId,
    });
    await secondTopic.save();
  };
  beforeEach(async () => {
    server = require("../../index");
    testSession = session(server);
    id = new mongoose.Types.ObjectId();
    secondTopicId = new mongoose.Types.ObjectId();
    childTopicId = new mongoose.Types.ObjectId();
    userAdminId = new mongoose.Types.ObjectId();
    userId = new mongoose.Types.ObjectId();
    linkIdOne = new mongoose.Types.ObjectId();
    linkIdTwo = new mongoose.Types.ObjectId();
    await createTopics();
    await createUser();
    await createUserAdmin();
  });
  afterEach(async () => {
    await User.collection.deleteMany();
    await Topic.collection.deleteMany();
    await server.close();
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("GET /:id", () => {
    beforeEach(async () => {
      await loginUser();
    });
    // test("should login user", async () => {
    //   const res = await loginUser()
    //   // const res = await testSession
    //   //   .post("/api/users/login")
    //   //   .send({ username: "regularuser", password: "123456" });
    //   console.log(res.body);
    //   expect(res.status).toBe(200);
    // });
    test("should return one topic for regular user", async () => {
      // const topic = new Topic({ _id: id, title: "Test Topic", user: userId });
      // console.log("topic", topic);
      // await topic.save();
      const res = await testSession.get("/api/topics/" + id);
      //console.log("res.req", res.req);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("title");
      expect(res.body.title).toBe("Test Topic");
      expect(res.body).toHaveProperty("slug");
      expect(res.body.slug).toBe("test-topic");
    });

    test("should return error 404 if topic not found", async () => {
      const res = await testSession.get("/api/topics/" + "wrongId");
      console.log(res.body);
      expect(res.status).toBe(404);
    });
  });
  // admin user
  describe("GET /", () => {
    beforeEach(async () => {
      await loginUserAdmin();
    });
    test("should return one topic for admin user", async () => {
      const res = await testSession.get("/api/topics/");
      expect(res.status).toBe(200);
      expect(res.body[0]).toHaveProperty("title");
      expect(res.body[0].title).toBe("Second Test Topic");
      expect(res.body[0]).toHaveProperty("slug");
      expect(res.body[0].slug).toBe("second-test-topic");
    });
    test("should return all topics for admin user", async () => {
      const res = await testSession.get("/api/topics/alltopics");
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
      return await testSession
        .post("/api/topics/")
        .send({ title: title, links: links, description: description });
    };
    beforeEach(async () => {
      title = "validTitle";
      links = [
        { description: "some description", url: "http://example.com" },
        { description: "another description", url: "http://example2.com" },
      ];
      description = "Some description";

      await loginUser();
    });
    test("should return 201  from express-validator if title input  properly formatted", async () => {
      links = undefined;
      const res = await execRequest();
      expect(res.status).toBe(201);
      expect(res.body.title).toBe("validTitle");
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

    test.only("should fill ancestor and parent", async () => {
      const childTopic = {
        _id: childTopicId,
        title: "Child Topic",
        description: "the child topic",
        user: userId,
        links: [
          {
            description: "some description 3",
            url: "http://example3.com",
          },
          {
            description: "another description 4",
            url: "http://example4.com",
          },
        ],
        parent: id,
      };
      const addTopic = await testSession.post("/api/topics").send(childTopic);
      const res = await testSession.get("/api/topics");
      console.log(res.body);
      expect(res.status).toBe(200);
      expect(res.body[1].ancestors).toEqual([
        { _id: mongoose.Types.ObjectId(id).toHexString(), slug: "test-topic", title: "Test Topic" },
      ]);
    });
  });
// TODO test
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
      const res = await testSession.patch("/api/topics/" + id).send({
        title: "Changed topic",
        links: [{ description: "web dev", url: "http:example.com" }],
      });
    });
    test("Should return 200, updated slug for correctly formatted title update request", async () => {
      const res = await testSession
        .patch("/api/topics/" + id)
        .send({ title: "Changed topic" });
      const changedTopic = await Topic.findById(id).exec();
      expect(res.status).toBe(200);
      expect(changedTopic.title).toBe("Changed topic");
      expect(changedTopic.slug).toBe("changed-topic");
    });

    test("Should return 200, updated slug and description for correctly formatted title update request", async () => {
      const changedTopic = await Topic.findById(id).exec();
      expect(changedTopic.title).toBe("Changed topic");
      expect(changedTopic.slug).toBe("changed-topic");
    });

    test("Should return 200, updated slug and new link for correctly formatted title update request", async () => {
      const changedTopic = await Topic.findById(id).exec();
      expect(changedTopic.title).toBe("Changed topic");
      expect(changedTopic.slug).toBe("changed-topic");
      // https:medium.com/@andrei.pfeiffer/jest-matching-objects-in-array-50fe2f4d6b98
      expect(changedTopic.links).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            description: "web dev",
            url: "http:example.com",
          }),
        ])
      );
    });

    test("Should return error,  for incorrectly formatted link update request", async () => {
      const res = await testSession.patch("/api/topics/" + id).send({
        title: "Changed topic",
        links: [{ description: "web dev", url: "examplecom" }],
      });
      const changedTopic = await Topic.findById(id).exec();
      expect(res.status).toBe(422);
    });
    test("Should return 400, for incorrectly formatted title", async () => {
      const res = await testSession
        .patch("/api/topics/" + id)
        .send({ title: {} });
      expect(res.status).toBe(400);
    });
    test("should update ancestors array after renaming parent", async (done) => {
      const childIdOne = new mongoose.Types.ObjectId();
      const childIdTwo = new mongoose.Types.ObjectId();
      const childTopicOne = new Topic({
        _id: childIdOne,
        title: "First child topic",
        parent: id,
      });
      await childTopicOne.save();
      const childTopicTwo = new Topic({
        _id: childIdTwo,
        title: "Second child topic",
        parent: id,
      });
      await childTopicTwo.save();

      const res2 = await testSession.get("/api/topics/" + childIdOne);

      const firstChildTopic = await Topic.findById(childIdOne);
      done();
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
      const res = await testSession.delete("/api/topics/" + id);
      expect(res.status).toBe(200);
      const deletedDoc = await Topic.findById(id).exec();
      expect(deletedDoc).toBe(null);
    });
  });
});
