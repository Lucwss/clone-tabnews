export class InternalServerError extends Error {
  constructor({ cause }) {
    super("An unexpected error occurred.", {
      cause,
    });

    this.name = "Internal Server Error.";
    this.action = "Contact your I.T support.";
    this.statusCode = 500;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}
