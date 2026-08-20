const request = require("supertest");
const app = require("../app");

describe("Authentication API", () => {
  test("POST /api/auth/login should reject invalid credentials", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "wrongemail@test.com",
        password: "wrongpassword",
      });

    expect(response.statusCode).toBe(401);

    expect(response.body).toHaveProperty(
      "message",
      "Invalid email or password"
    );
  });
});