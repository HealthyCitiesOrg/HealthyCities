const { ValidationError, EarthEngineError } = require("../utils/errors");

const errorHandler = (err, req, res, next) => {
  console.error(`❌ Error: ${err.message}`, err.stack);

  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      error: err.message,
      type: "ValidationError",
    });
  }

  if (err instanceof EarthEngineError) {
    return res.status(err.statusCode).json({
      error: err.message,
      type: "EarthEngineError",
    });
  }

  res.status(500).json({
    error: "Internal server error",
    type: "UnknownError",
  });
};

module.exports = errorHandler;
