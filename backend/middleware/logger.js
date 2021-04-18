/* eslint-disable import/no-unresolved */
const winston = require('winston');
const expressWinston = require('express-winston');

const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'request.log' })
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  )
});

// error logger
const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log' }),
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  )
});

module.exports = {
  requestLogger,
  errorLogger
};
