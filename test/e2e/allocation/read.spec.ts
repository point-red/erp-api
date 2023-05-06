import request from "supertest";
import AllocationGroupFactory from "../utils/factory/allocation-group.factory.js";
import UserFactory from "../utils/factory/user.factory.js";
import { createApp } from "@src/app.js";
import { db } from "@src/database/database.js";

describe("list all allocations", () => {
  let allocationGroup_id = "";
  beforeEach(async () => {
    // delete all allocation data
    await db.collection("allocations").deleteAll();

    // clear and insert user
    await new UserFactory(db).createUsers();

    // clear and insert allocation group
    const allocationGroup = await new AllocationGroupFactory(db).create();
    allocationGroup_id = allocationGroup._id;
  });
  it("should check user is authorized", async () => {
    const app = await createApp();
    // send request to create allocation
    const response = await request(app).get("/v1/allocations");
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
  //   const response = await request(app).get("/v1/allocations").set("Authorization", `Bearer ${accessToken}`);

  //   expect(response.statusCode).toEqual(403);
  //   expect(response.body.message).toBe("Forbidden Access");
  // });
  it("should read data from database", async () => {
    const app = await createApp();
    // get access token for authorization request
    const authResponse = await request(app).post("/v1/auth/signin").send({
      username: "admin",
      password: "admin2024",
    });
    const accessToken = authResponse.body.accessToken;

    // create data
    const data = {
      allocationGroup_id,
      name: "allocation A",
    };
    await request(app).post("/v1/allocations").send(data).set("Authorization", `Bearer ${accessToken}`);
    const data2 = {
      allocationGroup_id,
      name: "allocation B",
    };
    await request(app).post("/v1/allocations").send(data2).set("Authorization", `Bearer ${accessToken}`);

    const response = await request(app).get("/v1/allocations").set("Authorization", `Bearer ${accessToken}`);
    // expected response status
    expect(response.statusCode).toEqual(200);
    // expected response body
    expect(response.body.data[0]._id).not.toBeNull();
    expect(response.body.data[0].allocationGroup_id).toEqual(data.allocationGroup_id);
    expect(response.body.data[0].name).toEqual(data.name);
    expect(new Date(response.body.data[0].createdAt) instanceof Date).toBeTruthy();
    expect(response.body.data[0].createdBy_id).toBe(authResponse.body._id);

    expect(response.body.data[1]._id).not.toBeNull();
    expect(response.body.data[1].allocationGroup_id).toEqual(data2.allocationGroup_id);
    expect(response.body.data[1].name).toEqual(data2.name);
    expect(new Date(response.body.data[1].createdAt) instanceof Date).toBeTruthy();
    expect(response.body.data[1].createdBy_id).toBe(authResponse.body._id);

    expect(response.body.pagination.page).toEqual(1);
    expect(response.body.pagination.pageCount).toEqual(1);
    expect(response.body.pagination.pageSize).toEqual(10);
    expect(response.body.pagination.totalDocument).toEqual(2);
  });
});

describe("read allocation", () => {
  let allocationGroup_id = "";
  beforeEach(async () => {
    // delete all allocation data
    await db.collection("allocations").deleteAll();

    // clear and insert user
    await new UserFactory(db).createUsers();

    // clear and insert allocation group
    const allocationGroup = await new AllocationGroupFactory(db).create();
    allocationGroup_id = allocationGroup._id;
  });
  it("should check user is authorized", async () => {
    const app = await createApp();
    // send request to create allocation
    const response = await request(app).get("/v1/allocations/" + allocationGroup_id);
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
  //   const response = await request(app).get("/v1/allocations").set("Authorization", `Bearer ${accessToken}`);

  //   expect(response.statusCode).toEqual(403);
  //   expect(response.body.message).toBe("Forbidden Access");
  // });
  it("should read data from database", async () => {
    const app = await createApp();
    // get access token for authorization request
    const authResponse = await request(app).post("/v1/auth/signin").send({
      username: "admin",
      password: "admin2024",
    });
    const accessToken = authResponse.body.accessToken;

    // create data
    const data = {
      allocationGroup_id,
      name: "allocation A",
    };
    const responseCreate = await request(app)
      .post("/v1/allocations")
      .send(data)
      .set("Authorization", `Bearer ${accessToken}`);
    const response = await request(app)
      .get("/v1/allocations/" + responseCreate.body._id)
      .set("Authorization", `Bearer ${accessToken}`);
    // expected response status
    expect(response.statusCode).toEqual(200);
    // expected response body
    expect(response.body.data._id).not.toBeNull();
    expect(response.body.data.allocationGroup_id).toEqual(data.allocationGroup_id);
    expect(response.body.data.name).toEqual(data.name);
    expect(new Date(response.body.data.createdAt) instanceof Date).toBeTruthy();
    expect(response.body.data.createdBy_id).toBe(authResponse.body._id);
  });
});
