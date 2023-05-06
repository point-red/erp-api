import request from "supertest";
import AllocationGroupFactory from "../utils/factory/allocation-group.factory.js";
import UserFactory from "../utils/factory/user.factory.js";
import { createApp } from "@src/app.js";
import { db } from "@src/database/database.js";
import { ReadAllocationService } from "@src/modules/allocation/services/read.service.js";

describe("update allocation", () => {
  let _id = "";
  let allocationGroup_id = "";
  beforeEach(async () => {
    // delete allocation data
    await db.collection("allocations").deleteAll();

    // create user
    await new UserFactory(db).createUsers();

    // clear allocation group
    const allocationGroup = await new AllocationGroupFactory(db).create();
    allocationGroup_id = allocationGroup._id;

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
    const response = await request(app)
      .patch("/v1/allocations/" + _id)
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
  //   // send request to create allocation
  //   const response = await request(app)
  //     .patch("/v1/allocations/" + _id)
  //     .send({})
  //     .set("Authorization", `Bearer ${accessToken}`);

  //   expect(response.statusCode).toEqual(403);
  //   expect(response.body.message).toBe("Forbidden Access");
  // });
  it("should check required fields", async () => {
    const app = await createApp();
    // get access token for authorization request
    const authResponse = await request(app).post("/v1/auth/signin").send({
      username: "admin",
      password: "admin2024",
    });
    // send request to create allocation
    const accessToken = authResponse.body.accessToken;

    // do not send all required fields
    const response = await request(app)
      .patch("/v1/allocations/" + _id)
      .send({})
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.statusCode).toEqual(422);
    expect(response.body.message).toBe(
      "The request was well-formed but was unable to be followed due to semantic errors."
    );
    expect(response.body.errors.name).toEqual(["The name field is required."]);

    // only 1 required field?
    // only send 1 required fields
    // const response2 = await request(app)
    //   .patch("/v1/allocations/" + _id)
    //   .send({
    //     name: "allocation A",
    //   })
    //   .set("Authorization", `Bearer ${accessToken}`);
    // expect(response2.statusCode).toEqual(422);
    // expect(response2.body.message).toBe("Unprocessable Entity");
  });
  it("should check unique fields", async () => {
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
      name: "allocation B",
    };
    await request(app).post("/v1/allocations").send(data).set("Authorization", `Bearer ${accessToken}`);

    const response = await request(app)
      .patch("/v1/allocations/" + _id)
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
    // send request to create allocation
    const data = {
      name: "allocation AAA",
    };
    const response = await request(app)
      .patch("/v1/allocations/" + _id)
      .send(data)
      .set("Authorization", `Bearer ${accessToken}`);

    // expected response status
    expect(response.statusCode).toEqual(204);
    // expected database data by user input
    const readAllocationService = new ReadAllocationService(db);
    const result = await readAllocationService.handle(_id);
    expect(result.name).toEqual(data.name);
    // expected database data generated by system
    expect(result.updatedAt instanceof Date).toBeTruthy();
    expect(result.updatedBy_id).toBe(authResponse.body._id);
  });
});
