import orchestrator from "tests/orchestrator.js";
import { version as uuidVersion } from "uuid";
import session from "models/session"
import setCookieParser from "set-cookie-parser"

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/sessions", () => {
  describe("Anonymous user", () => {
    test("With incorrect `email` but correct `password`", async () => {
      await orchestrator.createUser({
        password: "senha-correta"
      })

      const response = await fetch("http://0.0.0.0:3000/api/v1/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "email.errado@emasi.com",
          password: "senha-correta",
        }),
      });

      expect(response.status).toBe(401);

      const responseBody = await response.json()

      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "No match data",
        action: "Check credentials.",
        status_code: 401,
      })
    });
    test("With correct `email` but incorrect `password`", async () => {
      await orchestrator.createUser({
        email: "email.correto@email.com"
      })

      const response = await fetch("http://0.0.0.0:3000/api/v1/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "email.correto@email.com",
          password: "senha-incorreta",
        }),
      });

      expect(response.status).toBe(401);

      const responseBody = await response.json()

      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "No match data",
        action: "Check credentials.",
        status_code: 401,
      })
    });
    test("With incorrect `email` and incorrect `password`", async () => {
      await orchestrator.createUser({})

      const response = await fetch("http://0.0.0.0:3000/api/v1/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "email.incorreto@email.com",
          password: "senha-incorreta",
        }),
      });

      expect(response.status).toBe(401);

      const responseBody = await response.json()

      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "No match data",
        action: "Check credentials.",
        status_code: 401,
      })
    });
    test("With correct `email` and correct `password`", async () => {
      const createdUser = await orchestrator.createUser({
        email: "tudocerto@email.com",
        password: "tudocerto",
      })

      const response = await fetch("http://0.0.0.0:3000/api/v1/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "tudocerto@email.com",
          password: "tudocerto",
        }),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json()

      expect(responseBody).toEqual({
        id: responseBody.id,
        token: responseBody.token,
        user_id: createdUser.id,
        expires_at: responseBody.expires_at,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at
      })

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(Date.parse(responseBody.expires_at)).not.toBeNaN();

      const expiresAt = new Date(responseBody.expires_at)
      const createdAt = new Date(responseBody.created_at)

      expiresAt.setMilliseconds(0)
      expiresAt.setSeconds(0)
      expiresAt.setHours(0)

      createdAt.setMilliseconds(0)
      createdAt.setSeconds(0)
      createdAt.setHours(0)

      expect(expiresAt - createdAt).toBe(session.EXPIRATION_IN_MILLISECONDS)

      const parsedSetCookie = setCookieParser(response, {
        map: true
      })
      expect(parsedSetCookie.session_id).toEqual({
        name: "session_id",
        httpOnly: true,
        path: "/",
        value: responseBody.token,
        maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000
      })
    });
  });
});
