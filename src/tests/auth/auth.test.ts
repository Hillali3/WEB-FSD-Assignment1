const request = require("supertest");
import { UUID } from "crypto";
import { Express } from "express";
import mongoose from "mongoose";
import User from "../../models/user";
import initApp from "../../server";
import { user as userTest } from "./authTestsData";

let app: Express;
let accessToken: string;
let userId: UUID;
let refreshToken: String;

beforeAll(async () => {
  app = await initApp();
  await User.deleteMany();
  const res = await request(app).post("/auth/register").send(userTest);
  accessToken = res.body.accessToken;
  refreshToken = res.body.refreshToken;
  userId = res.body.userId;
});

afterAll((done) => {
  mongoose.connection.close();
  done();
});

describe("Restric access without auth /", () => {
  test("It should response with error", async () => {
    const response = await request(app).get("/users");
    expect(response.status).not.toEqual(200);
  });
});

describe("Register", () => {
  test("Add new user", async () => {
    const response = await request(app).post("/auth/register").send({
      email: "blja",
      password: "pass",
      name: "hila",
      username: "hila.ohana",
    });
    expect(response.statusCode).toEqual(201);
  });
});

describe("Login", () => {
  test("Login user", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "blja",
      password: "pass",
      name: "hila",
      username: "hila.ohana",
    });
    accessToken = response.body.accessToken;
    refreshToken = response.body.refreshToken;
    expect(accessToken).not.toEqual(null);
    expect(refreshToken).not.toEqual(null);
  });
});

describe("Token access", () => {
  //   test("Authorized access", async () => {
  //     const response = await request(app)
  //       .get("/users")
  //       .set({ authorization: "JWT" + accessToken });
  //     expect(response.status).toEqual(200);
  //   });

  test("UnAuthorized access", async () => {
    let wrongToken =
      accessToken.slice(0, 6) + accessToken[10] + 1 + accessToken.slice(6 + 10);
    const response = await request(app)
      .get("/users")
      .set({ authorization: "JWT" + wrongToken });
    expect(response.status).not.toEqual(200);
  });
});

describe("Refresh Token", () => {
  test("Valid refresh token request", async () => {
    const response = await request(app)
      .post("/auth/refreshToken")
      .set("Authorization", "Bearer " + refreshToken);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("accessToken");
    expect(response.body).toHaveProperty("refreshToken");
  });

  test("Invalid token (missing or incorrect)", async () => {
    const incorrectRefreshToken = "refreshToken";
    const response = await request(app)
      .post("/auth/refreshToken")
      .set("Authorization", "Bearer " + incorrectRefreshToken);
    expect(response.status).toBe(403);
    expect(response.body.message).toBe("Invalid or expired token");
  });

  test("No token provided", async () => {
    const response = await request(app).post("/auth/refreshToken");

    expect(response.status).toBe(403);
    expect(response.body.message).toBe("Access denied");
  });
});
