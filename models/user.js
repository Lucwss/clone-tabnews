import database from "infra/database.js";
import { ValidationError, NotFoundError } from "infra/errors.js";

async function create(userInputValues) {
  await validateUniqueEmail(userInputValues.email);
  await validateUniqueUsername(userInputValues.username);

  const newUser = await runInQuery(userInputValues);
  return newUser;

  async function validateUniqueUsername(username) {
    const results = await database.query({
      text: `
      SELECT 
        username 
      FROM 
        users
      WHERE
        LOWER(username) = LOWER($1)
      ;`,

      values: [username],
    });

    if (results.rowCount > 0) {
      throw new ValidationError({
        message: "The username is already used.",
        action: "Choose a different username.",
      });
    }
  }

  async function validateUniqueEmail(email) {
    const results = await database.query({
      text: `
      SELECT 
        email 
      FROM 
        users
      WHERE
        LOWER(email) = LOWER($1)
      ;`,

      values: [email],
    });

    if (results.rowCount > 0) {
      throw new ValidationError({
        message: "The email is already used.",
        action: "Choose a different email.",
      });
    }
  }

  async function runInQuery() {
    const results = await database.query({
      text: `
      INSERT INTO 
        users (username, email, password) 
      VALUES 
        ($1, $2, $3)
      RETURNING
        *
      ;`,

      values: [
        userInputValues.username,
        userInputValues.email,
        userInputValues.password,
      ],
    });

    return results.rows[0];
  }
}

async function findOneByUsername(username) {
  const userFound = await runSelectQuery(username);
  return userFound;

  async function runSelectQuery(username) {
    const results = await database.query({
      text: `
      SELECT 
        * 
      FROM 
        users
      WHERE
        LOWER(username) = LOWER($1)
      LIMIT
        1
      ;`,

      values: [username],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "The username was not found in system",
        action: "Check if yout username is correct",
      });
    }

    return results.rows[0];
  }
}

const user = {
  create,
  findOneByUsername,
};

export default user;
