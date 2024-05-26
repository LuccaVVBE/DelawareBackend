class PrismaError extends Error {
    constructor(message, code = 400) {
      super(message);
      this.name = "server";
      this.code = code;
    }
  }

module.exports = PrismaError;