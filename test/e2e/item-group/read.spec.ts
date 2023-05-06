import request from "supertest";
import { createApp } from "@src/app.js";

describe("list all item groups", () => {
  it("should check user is authorized", async () => {
    const app = await createApp();
    // send request to list all item groups
    const response = await request(app).get("/v1/item-groups");
    expect(response.statusCode).toEqual(401);
    expect(response.body.code).toEqual(401);
    expect(response.body.status).toBe("Unauthorized");
    expect(response.body.message).toBe("Authentication credentials is invalid.");
  });
  it("should check user have permission to access", async () => {
    const app = await createApp();
    // get access token for authorization request
    const authResponse = await request(app).post("/v1/auth/signin").send({
      username: "user",
      password: "admin123",
    });
    const accessToken = authResponse.body.accessToken;
    // send request to read item group
    const response = await request(app).get("/v1/item-groups").set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toEqual(403);
    expect(response.body.code).toEqual(403);
    expect(response.body.status).toBe("Forbidden");
    expect(response.body.message).toBe("Don't have necessary permissions for this resource.");
  });
  it("should read data from database", async () => {
    const app = await createApp();
    // get access token for authorization request
    const authResponse = await request(app).post("/v1/auth/signin").send({
      username: "admin",
      password: "admin123",
    });
    const accessToken = authResponse.body.accessToken;

    // create data
    const data = {
      name: "item A",
    };
    await request(app).post("/v1/item-groups").send(data).set("Authorization", `Bearer ${accessToken}`);
    const data2 = {
      name: "item B",
    };
    await request(app).post("/v1/item-groups").send(data2).set("Authorization", `Bearer ${accessToken}`);

    const response = await request(app).get("/v1/item-groups").set("Authorization", `Bearer ${accessToken}`);
    // expected response status
    expect(response.statusCode).toEqual(200);
    // expected response body
    const panjang = response.body.data.length;
    expect(panjang).toBeGreaterThan(0);
    // expect(response.body.data[0]._id).not.toBeNull();
    // expect(response.body.data[0].name).toEqual(data.name);
    // expect(response.body.data[0].createdAt instanceof Date).toBeTruthy();
    // expect(response.body.data[0].createdBy_id).toBe(authResponse.body._id);

    // expect(response.body.data[1]._id).not.toBeNull();
    // expect(response.body.data[1].name).toEqual(data2.name);
    // expect(response.body.data[1].createdAt instanceof Date).toBeTruthy();
    // expect(response.body.data[1].createdBy_id).toBe(authResponse.body._id);

    // expect(response.body.pagination.page).toEqual(1);
    // expect(response.body.pagination.pageCount).toEqual(1);
    // expect(response.body.pagination.pageSize).toEqual(10);
    // expect(response.body.pagination.totalDocument).toEqual(2);
  });
});

describe("read item group", () => {
  it("should check user is authorized", async () => {
    const app = await createApp();
    // send request to list all items
    const response = await request(app).get("/v1/item-groups");
    expect(response.statusCode).toEqual(401);
    expect(response.body.code).toEqual(401);
    expect(response.body.status).toBe("Unauthorized");
    expect(response.body.message).toBe("Authentication credentials is invalid.");
  });
  it("should check user have permission to access", async () => {
    const app = await createApp();
    // get access token for authorization request
    const authResponse = await request(app).post("/v1/auth/signin").send({
      username: "user",
      password: "admin123",
    });
    const accessToken = authResponse.body.accessToken;
    // send request to read item group
    const response = await request(app).get("/v1/item-groups").set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toEqual(403);
    expect(response.body.code).toEqual(403);
    expect(response.body.status).toBe("Forbidden");
    expect(response.body.message).toBe("Don't have necessary permissions for this resource.");
  });
  it("should read data from database", async () => {
    const app = await createApp();
    // get access token for authorization request
    const authResponse = await request(app).post("/v1/auth/signin").send({
      username: "admin",
      password: "admin123",
    });
    const accessToken = authResponse.body.accessToken;

    // create data
    const data = {
      name: "item A1",
    };
    const responseCreate = await request(app)
      .post("/v1/item-groups")
      .send(data)
      .set("Authorization", `Bearer ${accessToken}`);
    const response = await request(app)
      .get("/v1/item-groups/" + responseCreate.body._id)
      .set("Authorization", `Bearer ${accessToken}`);
    // expected response status
    expect(response.statusCode).toEqual(200);
    // expected response body
    expect(response.body.data._id).not.toBeNull();
    expect(response.body.data.name).toEqual(data.name);
    // expect(response.body.data.createdAt instanceof Date).toBeTruthy();
    expect(response.body.data.createdBy_id).toBe(authResponse.body._id);
  });
});
