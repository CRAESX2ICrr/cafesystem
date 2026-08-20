const request = require("supertest");
const app = require("../app");

describe("Order API", () => {
  test("GET / should return backend running", async () => {
    const response = await request(app).get("/");

    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual({
      message: "Backend is running",
    });
  });

  test("POST /api/orders without token should be denied", async () => {
    const response = await request(app)
      .post("/api/orders")
      .send({
        items: [],
      });

    expect(response.statusCode).toBe(401);
  });
});