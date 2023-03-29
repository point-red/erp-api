import request from "supertest";
import { createApp } from "@src/app.js";

describe("create customer group", () => {
  it("should check user is authorized", async () => {
    const app = await createApp();
    // send request to create customer group
    const response = await request(app).post("/v1/customer-groups").send({});
    expect(response.statusCode).toEqual(401);
    expect(response.body.code).toBe(401);
    expect(response.body.status).toBe("Unauthorized");
    expect(response.body.message).toBe("Authentication credentials is invalid.");
  });
  it("should check user have permission to access", async () => {
    const app = await createApp();
    // get access token for authorization request
    const authResponse = await request(app).post("/v1/auth/signin").send({
      username: "user",
      password: "user2024",
    });
    const accessToken = authResponse.body.accessToken;
    // send request to create customer group
    const response = await request(app)
      .post("/v1/customer-groups")
      .send({})
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toEqual(403);
    expect(response.body.code).toBe(403);
    expect(response.body.status).toBe("Forbidden");
    expect(response.body.message).toBe("Don't have necessary permissions for this resource.");
  });
  it("should check required fields", async () => {
    const app = await createApp();
    // get access token for authorization request
    const authResponse = await request(app).post("/v1/auth/signin").send({
      username: "admin",
      password: "admin2024",
    });
    // send request to create customer group
    const accessToken = authResponse.body.accessToken;

    // do not send all required fields
    const response = await request(app)
      .post("/v1/customer-groups")
      .send({})
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.statusCode).toEqual(422);
    expect(response.body.status).toBe("Unprocessable Entity");
    expect(response.body.message).toBe(
      "The request was well-formed but was unable to be followed due to semantic errors."
    );
    expect(response.body.errors.name).toBe(["name is required"]);
  });
  it("should check unique fields", async () => {
    const app = await createApp();
    // get access token for authorization request
    const authResponse = await request(app).post("/v1/auth/signin").send({
      username: "admin",
      password: "admin2024",
    });
    const accessToken = authResponse.body.accessToken;
    // send request to create customer group
    const data = {
      name: "Group A",
    };
    await request(app).post("/v1/customer-groups").send(data).set("Authorization", `Bearer ${accessToken}`);
    const response = await request(app)
      .post("/v1/customer-groups")
      .send(data)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toEqual(422);
    expect(response.body.code).toBe(422);
    expect(response.body.status).toBe("Unprocessable Entity");
    expect(response.body.message).toBe(
      "The request was well-formed but was unable to be followed due to semantic errors."
    );
    expect(response.body.errors.name).toBe(["name is exists"]);
  });
  it("should save to database", async () => {
    const app = await createApp();
    // get access token for authorization request
    const authResponse = await request(app).post("/v1/auth/signin").send({
      username: "admin",
      password: "admin2024",
    });
    const accessToken = authResponse.body.accessToken;
    // send request to create customer group
    const data = {
      name: "Group A",
    };
    const response = await request(app)
      .post("/v1/customer-groups")
      .send(data)
      .set("Authorization", `Bearer ${accessToken}`);
    // expected response status
    expect(response.statusCode).toEqual(201);
    // expected response body
    expect(response.body._id).not.toBeNull();
    // expected database data by user input
    const customerService = new CustomerService(db);
    const result = customerService.read(response.body._id);
    expect(result._id).toEqual(data._id);
    expect(result.name).toEqual(data.name);
    // expected database data generated by system
    expect(result.createdAt instanceof Date).toBeTruthy();
    expect(result.createdBy_id).toBe(authResponse.body._id);
  });
});
