const UnauthorizedError = class extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
};

export default UnauthorizedError;
