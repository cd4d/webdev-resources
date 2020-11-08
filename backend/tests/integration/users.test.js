require("dotenv").config();
const mongoose = require("mongoose");

const supertest = require("supertest");
const { User } = require("../../models/users-model");

let server;
let id;
let userId;
const createUser = async () => {
  const user = new User({
    _id: userId,
    username: "regularuser",
    email: "regularuser@test.com",
    password: "123456",
    isAdmin: false,
  });
  await user.save();
  console.log("user created", user);
};

describe("Login", function () {
  beforeEach(async () => {
    server = require("../../index");
    userId = new mongoose.Types.ObjectId();
    const user = new User({
      _id: userId,
      username: "regularuser",
      email: "regularuser@test.com",
      password: "123456",
      isAdmin: false,
    });
    const registerUser = await User.register({username: "regularuser",
    email: "regularuser@test.com"},"123456");
  
  });
  afterEach(async () => {
    await User.collection.deleteMany();
    await server.close();
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should login user", async function () {
    const agent = supertest.agent(server);
    const user = await User.findById(userId);
    console.log(user);

    const res = await supertest(server)
      .post("/api/users/login")
      .send({ username: "regularuser", password: "123456" });
    expect(res.status).toBe(200)
  });
});
