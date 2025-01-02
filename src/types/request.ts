import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: any; // You can replace `any` with a specific type if you have a User type.
    }
  }
}
