import request from "supertest";
import UserFactory from "../utils/factory/user.factory.js";
import { createApp } from "@src/app.js";
import { db } from "@src/database/database.js";
import { ReadAllocationGroupService } from "@src/modules/allocation-group/services/read.service.js";

describe("update allocationGroup", () => {
  let _id = "";
  beforeEach(async () => {
    // delete allocation group
    await db.collection("allocationGroups").deleteAll();

    // create user
    await new UserFactory(db).createUsers();

    const app = await createApp();
    // get access token for authorization request
    const authResponse = await request(app).post("/v1/auth/signin").send({
      username: "admin",
      password: "admin2024",
    });
    const accessToken = authResponse.body.accessToken;
    // send request to create allocationGroup
    const data = {
      name: "allocationGroup A",
    };
    const response = await request(app)
      .post("/v1/allocation-groups")
      .send(data)
      .set("Authorization", `Bearer ${accessToken}`);
    _id = response.body._id;
  });
  it("should check user is authorized", async () => {
    const app = await createApp();
    // send request to create allocationGroup
    const response = await request(app)
      .patch("/v1/allocation-groups/" + _id)
      .send({});
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
  //   // send request to create allocationGroup
  //   const response = await request(app)
  //     .patch("/v1/allocation-groups/" + _id)
  //     .send({})
  //     .set("Authorization", `Bearer ${accessToken}`);

  //   expect(response.statusCode).toEqual(403);
  //   expect(response.body.message).toBe("Don't have necessary permissions for this resource.");
  // });
  it("should check required fields", async () => {
    const app = await createApp();
    // get access token for authorization request
    const authResponse = await request(app).post("/v1/auth/signin").send({
      username: "admin",
      password: "admin2024",
    });
    // send request to create allocationGroup
    const accessToken = authResponse.body.accessToken;

    // do not send all required fields
    const response = await request(app)
      .patch("/v1/allocation-groups/" + _id)
      .send({})
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.statusCode).toEqual(422);
    expect(response.body.message).toBe(
      "The request was well-formed but was unable to be followed due to semantic errors."
    );
    expect(response.body.errors.name).toEqual(["The name field is required."]);
  });
  it("should check unique fields", async () => {
    const app = await createApp();
    // get access token for authorization request
    const authResponse = await request(app).post("/v1/auth/signin").send({
      username: "admin",
      password: "admin2024",
    });
    const accessToken = authResponse.body.accessToken;
    // send request to create allocationGroup
    const data = {
      name: "allocationGroup B",
    };
    await request(app).post("/v1/allocation-groups").send(data).set("Authorization", `Bearer ${accessToken}`);

    const response = await request(app)
      .patch("/v1/allocation-groups/" + _id)
      .send(data)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toEqual(422);
    expect(response.body.message).toBe(
      "The request was well-formed but was unable to be followed due to semantic errors."
    );
    expect(response.body.errors.name).toEqual(["name is exists"]);
  });
  it("should save to database", async () => {
    const app = await createApp();
    // get access token for authorization request
    const authResponse = await request(app).post("/v1/auth/signin").send({
      username: "admin",
      password: "admin2024",
    });
    const accessToken = authResponse.body.accessToken;
    // send request to create allocationGroup
    const data = {
      name: "allocationGroup AAA",
    };
    const response = await request(app)
      .patch("/v1/allocation-groups/" + _id)
      .send(data)
      .set("Authorization", `Bearer ${accessToken}`);
    // expected response status
    expect(response.statusCode).toEqual(204);
    // expected database data by user input
    const allocationGroupService = new ReadAllocationGroupService(db);
    const result = await allocationGroupService.handle(_id);
    expect(result.name).toEqual(data.name);
    // expected database data generated by system
    expect(result.updatedAt instanceof Date).toBeTruthy();
    expect(result.updatedBy_id).toBe(authResponse.body._id);
  });
});
