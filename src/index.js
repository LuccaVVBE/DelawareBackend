const express = require('express');
const config = require('config');
const cors = require('cors');

const installREST = require('./rest/mainRouter.js');
const validator = require("./core/middlewares/validator.js");
const prismaErrorHandler = require('./core/middlewares/prismaErrorHandler.js');
const errorHandler = require('./core/middlewares/errorHandler.js');
const { checkJwsToken } = require("./core/middlewares/auth0.js");
const { initializeLogger } = require('./core/logging/logger');

const CORS_ORIGINS = config.get('cors.origins');
const CORS_MAX_AGE = config.get('cors.maxAge');

const app = express();

app.use(cors({
    origin: CORS_ORIGINS,
    allowHeaders: ['Accept', 'Content-Type', 'Authorization', 'Accept-Encoding'],
    maxAge: CORS_MAX_AGE
}));

// logger configs
const NODE_ENV = config.get('env');
const LOG_LEVEL = config.get('log.level');
const LOG_DISABLED = config.get('log.disabled');

// logs printout
console.log(`log level ${LOG_LEVEL}, logs enabled: ${LOG_DISABLED !== true}`);

// getting the logger to work
initializeLogger({
    level: LOG_LEVEL,
    disabled: LOG_DISABLED,
    defaultMeta: { NODE_ENV },
});

app.use(checkJwsToken());

app.use(express.json());

installREST(app);

// data validation middleware that uses joi schemas
validator(app);
// prisma error handler middleware
prismaErrorHandler(app);
// error handler middleware for all other errors
errorHandler(app);

module.exports = app;