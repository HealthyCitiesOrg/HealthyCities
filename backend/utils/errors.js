class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
  }
}

class EarthEngineError extends Error {
  constructor(message, originalError) {
    super(message);
    this.name = "EarthEngineError";
    this.statusCode = 500;
    this.originalError = originalError;
  }
}

module.exports = {
  ValidationError,
  EarthEngineError,
};
