const winston = require("winston");
const format = winston.format;
const { combine, timestamp, label, printf } = format;
const utils = require("next-core-utilities");

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.padEnd(5)}]: ${message}`;
});

const Logger = winston.createLogger({
  level: "debug",
  format: combine(
    format.colorize(),
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),
    myFormat
  ),
/*
  format.combine(
        format.timestamp({
          format: "YYYY-MM-DD HH:mm:ss"
        }),
        format.colorize(),
        format.json()
      ),
      */
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File({ filename: "./logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "./logs/combined.log" })
  ]
});

if (process.env.NODE_ENV !== "production") {
  Logger.add(new winston.transports.Console({
    format: combine(
      format.colorize(),
      timestamp({
        format: "YYYY-MM-DD HH:mm:ss"
      }),
      myFormat
    )
  }));
}

module.exports = Logger;
