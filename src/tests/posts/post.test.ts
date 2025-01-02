const request = require("supertest");
import initApp from "../../server";
import Post from "../../models/post";
import User from "../../models/user";
import mongoose from "mongoose";
import { Express } from "express";
import { posts, user as userTest } from "./postsTestsData";
import { UUID } from "crypto";

let app: Express;
let accessToken: string;
let userId: UUID;
let postId: UUID;

beforeAll(async () => {
  app = await initApp();
  await Post.deleteMany();
  await User.deleteMany();
  const res = await request(app).post("/auth/register").send(userTest);
  accessToken = res.body.accessToken;
  userId = res.body.userId;
});

afterAll((done) => {
  mongoose.connection.close();
  done();
});

describe("Posts Test", () => {
  test("Create Post", async () => {
    const response = await request(app)
      .post("/posts/")
      .send({ ...posts[0], userId })
      .set("Authorization", `Bearer ${accessToken}`);
    postId = response.body._id;
    expect(response.status).toBe(201);
    expect(response.body.title).toBe(posts[0].title);
    expect(response.body.content).toBe(posts[0].content);
    expect(response.body.userId).toBe(userId);
  });
  test("Get All Posts", async () => {
    const response = await request(app)
      .get("/posts/")
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
  });
  test("Get Post by ID", async () => {
    const response = await request(app)
      .get(`/posts/id/${postId}`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.status).toBe(200);
    expect(response.body.title).toBe(posts[0].title);
    expect(response.body.content).toBe(posts[0].content);
    expect(response.body.userId).toBe(userId);
  });
  test("Update Post", async () => {
    const response = await request(app)
      .put(`/posts/${postId}`)
      .send({ title: "New Title" })
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.status).toBe(200);
    expect(response.body.title).toBe("New Title");
  });
  test("Get All Posts by User ID", async () => {
    const response = await request(app)
      .get(`/posts/userId/${userId}`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
  });
  test("Get All Posts by Username", async () => {
    const response = await request(app)
      .get(`/posts/username/${userTest.username}`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
  });
  test("Delete Post", async () => {
    const response = await request(app)
      .delete(`/posts/${postId}`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.status).toBe(200);
  });
  test("Get All Posts after Delete", async () => {
    const response = await request(app)
      .get("/posts/")
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(0);
  });
});
