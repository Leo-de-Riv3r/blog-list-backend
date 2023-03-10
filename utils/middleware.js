const logger = require("./logger");

const requestLogger = (req, res, next) => {
  logger.info(req.body);
  next();
};


const unknownEndpoint = (req, res) => {
  res.status(404).json({
    error: "unknown endpoint",
  });
};

const errorHandler = (error, req, res, next) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name == "ValidationError") {
    return res.status(400).json({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: "invalid token" });
  }

  next(error);
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
};
