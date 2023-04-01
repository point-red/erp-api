import request from "supertest";
import { createApp } from "@src/app.js";

describe("archive machine", () => {
  let _id = "";
  let _accessToken = "";
  beforeEach(async () => {
    const app = await createApp();
    // get access token for authorization request
    const authResponse = await request(app).post("/v1/auth/signin").send({
      username: "admin",
      password: "admin2024",
    });
    _accessToken = authResponse.body.accessToken;
    // send request to create machine
    const data = {
      name: "machine A",
    };
    const response = await request(app).post("/v1/machines").send(data).set("Authorization", `Bearer ${_accessToken}`);
    _id = response.body._id;
  });

  it("should check user is authorized", async () => {
    const app = await createApp();
    // // // send request to create machine
    const response = await request(app).patch("/v1/machines/" + _id + "/archive");
    // const response = await request(app).patch("/v1/machines/" + _id + "/archive");
    console.log("ini response patch ", response.body);
    expect(response.statusCode).toEqual(401);
    // expect(response.body.status).toBe("Unauthorized");
  });

  // it("should check user have permission to access", async () => {
  //   const app = await createApp();
  //   // get access token for authorization request
  //   const authResponse = await request(app).post("/v1/auth/signin").send({
  //     username: "user",
  //     password: "user2024",
  //   });
  //   const accessToken = authResponse.body.accessToken;
  //   // send request to read machine
  //   const response = await request(app)
  //     .patch("/v1/machines/" + _id + "/archive")
  //     .set("Authorization", `Bearer ${accessToken}`);

  //   expect(response.statusCode).toEqual(403);
  //   expect(response.body.message).toBe("Forbidden Access");
  // });

  // it("should delete data from database", async () => {
  //   const app = await createApp();
  //   // get access token for authorization request
  //   const authResponse = await request(app).post("/v1/auth/signin").send({
  //     username: "admin",
  //     password: "admin2024",
  //   });
  //   const accessToken = authResponse.body.accessToken;
  //   console.log("ini token ", accessToken);

  //   const responseDelete = await request(app)
  //     .patch("/v1/machines/" + _id + "/archive")
  //     .set("Authorization", `Bearer ${_accessToken}`);
  //   // expected response status
  //   expect(responseDelete.statusCode).toEqual(204);

  //   console.log("response body ", responseDelete);

  //   const response = await request(app)
  //     .get("/v1/machines/" + _id)
  //     .set("Authorization", `Bearer ${_accessToken}`);
  //   // expected response status
  //   expect(response.statusCode).toEqual(200);
  //   // expected response body
  //   expect(response.body.isArchived).toBe(true);
  // });
});
