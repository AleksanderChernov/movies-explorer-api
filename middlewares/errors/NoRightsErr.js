class NotFoundErr extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = NotFoundErr;
