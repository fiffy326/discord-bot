import config from "./utils/config.js";
import log from "./utils/log.js";
import { REST, Routes } from "discord.js";

/* Delete guild commands */
const rest = new REST().setToken(config.api.discord.token);
rest
  .put(
    Routes.applicationGuildCommands(
      config.api.discord.clientId,
      config.api.discord.guildId
    ),
    { body: [] }
  )
  .then(() => log.info(`Successfully deleted all guild commands.`))
  .catch(log.error);
