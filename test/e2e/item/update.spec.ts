import request from "supertest";
import { createApp } from "@src/app.js";
import { db } from "@src/database/database";
import { ReadItemService } from "@src/modules/item/services/read.service";

describe("update item", () => {
  let _id = "";
  beforeEach(async () => {
    const app = await createApp();
    // get access token for authorization request
    const authResponse = await request(app).patch("/v1/auth/signin").send({
      username: "admin",
      password: "admin2024",
    });
    const accessToken = authResponse.body.accessToken;
    // send request to create item
    const data = {
      code: "A1",
      name: "item A",
      chartOfAccount: "Goods",
      hasProductionNumber: true,
      hasExpiryDate: false,
      unit: "pcs",
      converter: [
        {
          name: "dozen",
          multiply: 12,
        },
      ],
    };
    const response = await request(app).post("/v1/items").send(data).set("Authorization", `Bearer ${accessToken}`);
    _id = response.body._id;
  });
  it("should check user is authorized", async () => {
    const app = await createApp();
    // send request to create item
    const response = await request(app)
      .patch("/v1/items/" + _id)
      .send({});
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
      password: "user2024",
    });
    const accessToken = authResponse.body.accessToken;
    // send request to create item
    const response = await request(app)
      .patch("/v1/items/" + _id)
      .send({})
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toEqual(401);
    expect(response.body.code).toEqual(401);
    expect(response.body.status).toBe("Unauthorized");
    expect(response.body.message).toBe("Authentication credentials is invalid.");
  });
  it("should check required fields", async () => {
    const app = await createApp();
    // get access token for authorization request
    const authResponse = await request(app).post("/v1/auth/signin").send({
      username: "admin",
      password: "admin2024",
    });
    // send request to create item
    const accessToken = authResponse.body.accessToken;

    // do not send all required fields
    const response = await request(app)
      .patch("/v1/items/" + _id)
      .send({})
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.statusCode).toEqual(422);
    expect(response.body.status).toBe("Unprocessable Entity");
    expect(response.body.message).toBe(
      "The request was well-formed but was unable to be followed due to semantic errors."
    );
    expect(response.body.errors.name).toEqual(["The name field is required."]);
    expect(response.body.errors.chartOfAccount).toEqual(["The chartOfAccount field is required."]);
    expect(response.body.errors.unit).toEqual(["The unit field is required."]);

    // only send 1 required fields
    const response2 = await request(app)
      .patch("/v1/items/" + _id)
      .send({
        name: "item A",
      })
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response2.statusCode).toEqual(422);
    expect(response2.body.message).toEqual(
      "The request was well-formed but was unable to be followed due to semantic errors."
    );
    expect(response2.body.errors.chartOfAccount).toEqual(["The chartOfAccount field is required."]);
    expect(response2.body.errors.unit).toEqual(["The unit field is required."]);
  });
  it("should check unique fields", async () => {
    const app = await createApp();
    // get access token for authorization request
    const authResponse = await request(app).post("/v1/auth/signin").send({
      username: "admin",
      password: "admin2024",
    });
    const accessToken = authResponse.body.accessToken;
    // send request to create item
    const data = {
      code: "A1",
      name: "item A",
      chartOfAccount: "Goods",
      hasProductionNumber: true,
      hasExpiryDate: false,
      unit: "pcs",
      converter: [
        {
          name: "dozen",
          multiply: 12,
        },
      ],
    };

    const response = await request(app)
      .patch("/v1/items/" + _id)
      .send(data)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toEqual(422);
    expect(response.body.message).toBe("Unprocessable Entity");
    expect(response.body.errors.code).toBe(["code is exists"]);
    expect(response.body.errors.name).toBe(["name is exists"]);
  });
  it("should save to database", async () => {
    const app = await createApp();
    // get access token for authorization request
    const authResponse = await request(app).patch("/v1/auth/signin").send({
      username: "admin",
      password: "admin2024",
    });
    const accessToken = authResponse.body.accessToken;
    // send request to create item
    const data = {
      name: "item AAA",
    };
    const response = await request(app)
      .patch("/v1/items/" + _id)
      .send(data)
      .set("Authorization", `Bearer ${accessToken}`);
    // expected response status
    expect(response.statusCode).toEqual(204);
    // expected database data by user input
    const itemService = new ReadItemService(db);
    const result = await itemService.handle(response.body._id);
    expect(result.name).toEqual("AAA");
    // expected database data generated by system
    expect(result.updatedBy_id).toBe(authResponse.body._id);
  });
});
