const config = require("./utils/config");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users")
const loginrouter = require("./controllers/login")
const express = require("express");
require("express-async-errors");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

logger.info("Connecting to MongoDB");

mongoose
  .connect(config.MONGODB_URI)
  .then(() => logger.info("Successfully connected"))
  .catch((err) => logger.error("Could not connect to MongoDB"));

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);
app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginrouter);
app.use(middleware.unknownEndpoint);

module.exports = app;
