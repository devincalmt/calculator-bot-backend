import request from "supertest";

import app from "../index";
import { UserModel } from "../models/user";

import { faker } from "@faker-js/faker";

describe("POST /api/login", () => {
  it("Should return 200 for existing or not existing user", async () => {
    const email = faker.internet.email().toLowerCase();
    const res = await request(app).post("/api/login").send({
      email: email,
    });

    const user = await UserModel.findOne({ email });
    expect(user?._id?.toString()).toEqual(res.body.data);
  });
});
