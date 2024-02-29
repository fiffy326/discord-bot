import config from "../config.json" with { type: "json" };
import log from "./utils/log.js";
import { REST, Routes } from "discord.js";

/* Delete guild commands */
const rest = new REST().setToken(config.apis.discord.token);
rest
  .put(
    Routes.applicationGuildCommands(
      config.apis.discord.clientId,
      config.apis.discord.guildId
    ),
    { body: [] }
  )
  .then(() => log.info(`Successfully deleted all guild commands.`))
  .catch(log.error);
