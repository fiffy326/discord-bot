import config from "./config.js";
import chalk from "chalk";
import DailyRotateFile from "winston-daily-rotate-file";
import { createLogger, format, transports } from "winston";
const { align, colorize, combine, json, padLevels, printf, timestamp } = format;

const logLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
  },
  colors: {
    fatal: "bold red",
    error: "red",
    warn: "yellow",
    info: "blue",
    debug: "cyan",
    trace: "magenta",
  },
};

const consoleFormat = combine(
  padLevels({ levels: logLevels.levels }),
  timestamp({ format: config.logging.console.timestampFormat }),
  colorize({ colors: logLevels.colors, level: true }),
  format(info => {
    info.level = `[${info.level}]`;
    info.message = `${chalk.hex("#dddddd")(info.message)}`;
    info.timestamp = `[${chalk.hex("#999999")(`${info.timestamp}`)}]`;
    return info;
  })(),
  printf(info => `${info.timestamp} ${info.level}${info.message}`),
  align()
);

const logger = createLogger({
  levels: logLevels.levels,
  transports: [
    new transports.Console({
      format: consoleFormat,
      level: config.logging.console.level,
    }),
    new DailyRotateFile({
      format: combine(timestamp(), json()),
      level: config.logging.file.level,
      datePattern: config.logging.file.datePattern,
      maxFiles: config.logging.file.maxFiles,
      maxSize: config.logging.file.maxSize,
      filename: "logs/%DATE%.log",
    }),
  ],
});

export const log = {
  fatal: (message: any) => logger.log("fatal", message),
  error: (message: any) => logger.log("error", message),
  warn: (message: any) => logger.log("warn", message),
  info: (message: any) => logger.log("info", message),
  debug: (message: any) => logger.log("debug", message),
  trace: (message: any) => logger.log("trace", message),
};

export default log;
