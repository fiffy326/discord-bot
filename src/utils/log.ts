import { config } from "@utils/config.js";
import chalk from "chalk";
import { createLogger, format, transports } from "winston";
import dailyRotateFile from "winston-daily-rotate-file";

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

const consoleTransport = new transports.Console({
  level: config.log.console.level,
  stderrLevels: ["fatal", "error", "warn"],
  consoleWarnLevels: ["fatal", "error", "warn"],
  format: format.combine(
    format.padLevels({ levels: logLevels.levels }),
    format.timestamp({ format: "YYYY-MM-DD hh:mm:ss A" }),
    format.colorize({ colors: logLevels.colors, level: true }),
    format((info) => {
      info.level = `[${info.level}]`;
      info.message = `${chalk.hex("#dddddd")(info.message)}`;
      info.timestamp = `[${chalk.hex("#999999")(`${info.timestamp}`)}]`;
      return info;
    })(),
    format.printf((info) => `${info.timestamp} ${info.level}${info.message}`),
    format.align(),
  ),
});

const fileTransport = new dailyRotateFile({
  level: config.log.file.level,
  zippedArchive: config.log.file.compress,
  maxFiles: `${config.log.file.max_days}d`,
  utc: true,
  datePattern: "YYYY-MM-DD",
  dirname: "logs",
  filename: "%DATE%",
  extension: ".log",
  symlinkName: "current.log",
  createSymlink: true,
  format: format.combine(format.timestamp(), format.json()),
});

const logger = createLogger({
  levels: logLevels.levels,
  transports: config.log.file.level !== undefined ? [consoleTransport, fileTransport] : [consoleTransport],
});

export const log = {
  fatal: (message: unknown) => logger.log("fatal", message),
  error: (message: unknown) => logger.log("error", message),
  warn: (message: unknown) => logger.log("warn", message),
  info: (message: unknown) => logger.log("info", message),
  debug: (message: unknown) => logger.log("debug", message),
  trace: (message: unknown) => logger.log("trace", message),
};
