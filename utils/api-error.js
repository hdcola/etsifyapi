class ApiError extends Error {
  constructor(message, statusCode, errors) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    this.errors = errors;
  }

  static badRequest(msg, errors) {
    return new ApiError(msg, 400, errors);
  }

  static unauthorized(msg) {
    return new ApiError(msg, 401);
  }

  static forbidden(msg) {
    return new ApiError(msg, 403);
  }

  static notFound(msg) {
    return new ApiError(msg, 404);
  }

  static internal(msg) {
    return new ApiError(msg || 'Internal Server Error', 500);
  }
}

module.exports = ApiError;
