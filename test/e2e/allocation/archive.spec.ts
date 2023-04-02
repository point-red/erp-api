import request from "supertest";
import AllocationGroupFactory from "../utils/factory/allocation-group.factory.js";
import UserFactory from "../utils/factory/user.factory.js";
import { createApp } from "@src/app.js";
import { db } from "@src/database/database.js";

describe("archive allocation", () => {
  let _id = "";
  beforeEach(async () => {
    // delete all allocation data
    await db.collection("allocations").deleteAll();

    // clear and insert user
    await new UserFactory(db).createUsers();

    // clear and insert allocation group
    const allocationGroup = await new AllocationGroupFactory(db).create();
    const allocationGroup_id = allocationGroup._id;

    const app = await createApp();
    // get access token for authorization request
    const authResponse = await request(app).post("/v1/auth/signin").send({
      username: "admin",
      password: "admin2024",
    });
    const accessToken = authResponse.body.accessToken;
    // send request to create allocation
    const data = {
      allocationGroup_id,
      name: "allocation A",
    };
    const response = await request(app)
      .post("/v1/allocations")
      .send(data)
      .set("Authorization", `Bearer ${accessToken}`);
    _id = response.body._id;
  });
  it("should check user is authorized", async () => {
    const app = await createApp();
    // send request to create allocation
    const response = await request(app).patch("/v1/allocations/" + _id + "/archive");
    expect(response.statusCode).toEqual(401);
    expect(response.body.message).toBe("Authentication credentials is invalid.");
  });
  // TO DO : wait until permission fixed
  // it("should check user have permission to access", async () => {
  //   const app = await createApp();
  //   // get access token for authorization request
  //   const authResponse = await request(app).post("/v1/auth/signin").send({
  //     username: "user",
  //     password: "user2024",
  //   });
  //   const accessToken = authResponse.body.accessToken;
  //   // send request to read allocation
  //   const response = await request(app)
  //     .patch("/v1/allocations/" + _id + "/archive")
  //     .set("Authorization", `Bearer ${accessToken}`);

  //   expect(response.statusCode).toEqual(403);
  //   expect(response.body.message).toBe("Forbidden Access");
  // });
  it("should delete data from database", async () => {
    const app = await createApp();
    // get access token for authorization request
    const authResponse = await request(app).post("/v1/auth/signin").send({
      username: "admin",
      password: "admin2024",
    });
    const accessToken = authResponse.body.accessToken;
    const responseDelete = await request(app)
      .patch("/v1/allocations/" + _id + "/archive")
      .set("Authorization", `Bearer ${accessToken}`);
    // expected response status
    expect(responseDelete.statusCode).toEqual(204);

    const response = await request(app)
      .get("/v1/allocations/" + _id)
      .set("Authorization", `Bearer ${accessToken}`);
    // expected response status
    expect(response.statusCode).toEqual(200);
    // expected response body
    expect(response.body.data.isArchived).toBe(true);
  });
});
