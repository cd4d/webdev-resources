require("dotenv").config();

let supertestRequest = require("supertest");
const mongoose = require("mongoose");

const  Topic  = require("../../models/topics-model");

let server;

describe("api/topics", () =>{
    beforeEach(() => {
        server = require("../../index")
    })
    afterEach(async () =>{
        await Topic.collection.deleteMany()
        await server.close()
        await mongoose.connection.close()
    })

    describe("GET /", ()=>{
        test("should return all topics" , async () => {
            const topic = new Topic({title:"TestTopic"})
            await topic.save()
            const res = await supertestRequest(server).get("/api/topics/")
            expect(res.status).toBe(200)
            expect(res.body[0]).toHaveProperty("title");
            expect(res.body[0].title).toBe("TestTopic");
        })
        
    })
})