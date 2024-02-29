import config from "../../config.json" with { type: "json" };
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
    info: "green",
    debug: "blue",
    trace: "magenta",
  },
};

const consoleFormat = combine(
  padLevels({ levels: logLevels.levels }),
  timestamp({ format: config.logs.console.timestampFormat }),
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
      level: config.logs.console.level,
    }),
    new DailyRotateFile({
      format: combine(timestamp(), json()),
      level: config.logs.file.level,
      datePattern: config.logs.file.datePattern,
      maxFiles: config.logs.file.maxFiles,
      maxSize: config.logs.file.maxSize,
      filename: "logs/%DATE%.log",
    }),
  ],
});

/* eslint-disable @typescript-eslint/no-explicit-any */
export const log = {
  fatal: (message: any) => logger.log("fatal", message),
  error: (message: any) => logger.log("error", message),
  warn: (message: any) => logger.log("warn", message),
  info: (message: any) => logger.log("info", message),
  debug: (message: any) => logger.log("debug", message),
  trace: (message: any) => logger.log("trace", message),
};

export default log;
