import config from "../config.json" with { type: "json" };
import log from "./utils/log.js";
import { REST, Routes } from "discord.js";

/* Delete global commands */
const rest = new REST().setToken(config.apis.discord.token);
rest
  .put(Routes.applicationCommands(config.apis.discord.clientId), { body: [] })
  .then(() => log.info(`Successfully deleted all global commands.`))
  .catch(log.error);
