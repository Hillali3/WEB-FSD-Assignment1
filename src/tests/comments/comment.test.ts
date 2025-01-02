const request = require("supertest");
import initApp from "../../server";
import Post from "../../models/post";
import User from "../../models/user";
import Comment from "../../models/comment";
import mongoose from "mongoose";
import { Express } from "express";
import { posts, user as userTest } from "../posts/postsTestsData";
import { comments } from "./commentsTestsData";
import { UUID } from "crypto";

let app: Express;
let accessToken: string;
let userId: UUID;
let postId: UUID;
let commentId: UUID;

beforeAll(async () => {
  app = await initApp();
  await Post.deleteMany();
  await User.deleteMany();
  await Comment.deleteMany();
  const authResponse = await request(app).post("/auth/register").send(userTest);
  accessToken = authResponse.body.accessToken;
  userId = authResponse.body.userId;
  const postResponse = await request(app)
    .post("/posts/")
    .send({ ...posts[0], userId })
    .set("Authorization", `Bearer ${accessToken}`);
  postId = postResponse.body._id;
});

afterAll((done) => {
  mongoose.connection.close();
  done();
});

describe("Posts Test", () => {
  test("Create Comment", async () => {
    const response = await request(app)
      .post(`/comments`)
      .send({ ...comments[0], userId, postId })
      .set("Authorization", `Bearer ${accessToken}`);
    commentId = response.body._id;
    expect(response.status).toBe(201);
    expect(response.body.text).toBe(comments[0].text);
    expect(response.body.userId).toBe(userId);
    expect(response.body.postId).toBe(postId);
  });
  test("Get Comment by ID", async () => {
    const response = await request(app)
      .get(`/comments/id/${commentId}`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.status).toBe(200);
    expect(response.body.text).toBe(comments[0].text);
    expect(response.body.userId).toBe(userId);
    expect(response.body.postId).toBe(postId);
  });
  test("Get Comment by Post ID", async () => {
    const response = await request(app)
      .get(`/comments/postId/${postId}`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
  });
  test("Update Comment", async () => {
    const response = await request(app)
      .put(`/comments/${commentId}`)
      .send({ text: "New Comment" })
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.status).toBe(200);
    expect(response.body.text).toBe("New Comment");
  });
  test("Delete Comment", async () => {
    const response = await request(app)
      .delete(`/comments/${commentId}`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.status).toBe(200);
  });
});
