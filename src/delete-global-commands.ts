import config from "./utils/config.js";
import log from "./utils/log.js";
import { REST, Routes } from "discord.js";

/* Delete global commands */
const rest = new REST().setToken(config.api.discord.token);
rest
  .put(Routes.applicationCommands(config.api.discord.clientId), { body: [] })
  .then(() => log.info(`Successfully deleted all global commands.`))
  .catch(log.error);
