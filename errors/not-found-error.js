const NotFoundError = class extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
};

export default NotFoundError;
