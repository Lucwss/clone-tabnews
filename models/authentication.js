import user from "./user";
import password from "./password";
import { NotFoundError, UnauthorizedError } from "../infra/errors";

async function getAuthenticatedUser(providedEmail, providedPassword) {
  try {
    const storedUser = await findUserByEmail(providedEmail);
    await validatePassword(providedPassword, storedUser.password);

    return storedUser;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw new UnauthorizedError({
        message: "No match data",
        action: "Check credentials.",
      });
    }

    throw error;
  }

  async function findUserByEmail(providedEmail) {
    let storedUser;

    try {
      storedUser = await user.findOneByEmail(providedEmail);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new UnauthorizedError({
          message: "Incorrect Email",
          action: "Check credentials.",
        });
      }

      throw error;
    }

    return storedUser;
  }

  async function validatePassword(providedPassword, storedPassword) {
    const correctPassword = await password.compare(
      providedPassword,
      storedPassword,
    );

    if (!correctPassword) {
      throw new UnauthorizedError({
        message: "Incorrect Password",
        action: "Check credentials.",
      });
    }
  }
}

const authentication = {
  getAuthenticatedUser,
};

export default authentication;
