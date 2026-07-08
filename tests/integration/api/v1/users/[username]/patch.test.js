import orchestrator from "tests/orchestrator.js";
import { version as uuidVersion } from "uuid";
import user from "../../../../../../models/user";
import password from "../../../../../../models/password";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH /api/v1/users/[username]", () => {
  describe("Anonymous user", () => {
    test("With non existent 'username'", async () => {
      const response = await fetch(
        "http://0.0.0.0:3000/api/v1/users/notExistUser",
        {
          method: "PATCH",
        },
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "The username was not found in system",
        action: "Check if yout username is correct",
        status_code: 404,
      });
    });
    test("With duplicated username", async () => {
      const createdUser1 = await orchestrator.createUser({});
      const createdUser2 = await orchestrator.createUser({});

      const response = await fetch(
        `http://0.0.0.0:3000/api/v1/users/${createdUser2.username}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: createdUser1.username,
          }),
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "The username is already used.",
        action: "Choose a different username for this operation.",
        status_code: 400,
      });
    });
    test("With duplicated email", async () => {
      const createdUser1 = await orchestrator.createUser({});
      const createdUser2 = await orchestrator.createUser({});

      const response = await fetch(
        `http://0.0.0.0:3000/api/v1/users/${createdUser2.username}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: createdUser1.email,
          }),
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "The email is already used.",
        action: "Choose a different email.",
        status_code: 400,
      });
    });
    test("With unique username", async () => {
      const createdUser1 = await orchestrator.createUser({});
      const newUserName = "uniqueUser2";

      const response = await fetch(
        `http://0.0.0.0:3000/api/v1/users/${createdUser1.username}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: newUserName,
          }),
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: newUserName,
        email: createdUser1.email,
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
    });
    test("With unique email", async () => {
      const createdUser1 = await orchestrator.createUser({});
      const newUniqueEmail = "uniqueEmail2@email.com";
      const response = await fetch(
        `http://0.0.0.0:3000/api/v1/users/${createdUser1.username}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: newUniqueEmail,
          }),
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: createdUser1.username,
        email: newUniqueEmail,
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
    });
    test("With new password", async () => {
      const createdUser1 = await orchestrator.createUser({});
      const newPassword = "newPassword2";
      const response = await fetch(
        `http://0.0.0.0:3000/api/v1/users/${createdUser1.username}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: newPassword,
          }),
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: createdUser1.username,
        email: createdUser1.email,
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      expect(responseBody.updated_at > responseBody.created_at).toBe(true);

      const userInDatabase = await user.findOneByUsername(
        createdUser1.username,
      );
      const correctPasswordMatch = await password.compare(
        newPassword,
        userInDatabase.password,
      );
      const incorrectPasswordMatch = await password.compare(
        "newPassword1",
        userInDatabase.password,
      );
      expect(correctPasswordMatch).toBe(true);
      expect(incorrectPasswordMatch).toBe(false);
    });
  });
});
