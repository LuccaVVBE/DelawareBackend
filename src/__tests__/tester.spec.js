const app = require('../index')
const request = require("supertest");

// a test to check if status endpoint is working
describe("Test the /testCon path", () => {
    it("should respond with status code 200", async () => {
      return request(app)
        .get("/testCon")
        .then(response => {
          expect(response.statusCode).toBe(200);
        });
    });
});