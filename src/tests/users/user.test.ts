const request = require("supertest");
import { UUID } from "crypto";
import { Express } from "express";
import mongoose from "mongoose";
import User from "../../models/user";
import initApp from "../../server";
import { users } from "./usersTestsData";

let app: Express;
let accessToken: string;
let userId: UUID;

const testUser = users[0];

const newUser = {
  username: "john_doe",
  name: "John Doe",
  email: "john@example.com",
  password: "password123",
};

beforeAll(async () => {
  app = await initApp();
  await User.deleteMany();
  const res = await request(app).post("/auth/register").send(newUser);
  accessToken = res.body.accessToken;
  userId = res.body.userId;
});

afterAll((done) => {
  mongoose.connection.close();
  done();
});

describe("Users Test", () => {
  test("Create User", async () => {
    const response = await request(app)
      .post("/users/")
      .send(testUser)
      .set("Authorization", `Bearer ${accessToken}`);
    userId = response.body._id;
    expect(response.status).toBe(201);
    expect(response.body.username).toBe(testUser.username);
    expect(response.body.name).toBe(testUser.name);
    expect(response.body.email).toBe(testUser.email);
  });
  test("Get All Users", async () => {
    const response = await request(app)
      .get("/users/")
      .set("Authorization", `Bearer ${accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
    });
    test("Get User by ID", async () => {
      const response = await request(app)
      .get(`/users/id/${userId}`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.status).toBe(200);
    expect(response.body.username).toBe(testUser.username);
    expect(response.body.name).toBe(testUser.name);
    expect(response.body.email).toBe(testUser.email);
  });
  test("Update User", async () => {
    const response = await request(app)
      .put(`/users/${userId}`)
      .send({ password: "New Password" })
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.status).toBe(200);
  });
  test("Delete User", async () => {
    const response = await request(app)
      .delete(`/users/${userId}`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.status).toBe(200);
  });
  test("Get All Users after Delete", async () => {
    const response = await request(app)
      .get("/users/")
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
  });
});
