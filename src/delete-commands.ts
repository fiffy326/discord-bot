import config from "./utils/config.js";
import log from "./utils/log.js";
import { argv } from "process";
import { REST, Routes } from "discord.js";

const rest = new REST().setToken(config.api.discord.token);

function deleteGlobalCommands() {
  rest
    .put(Routes.applicationCommands(config.api.discord.clientId), { body: [] })
    .then(() => log.info("Successfully deleted all global commands."))
    .catch(log.error);
}

function deleteGuildCommands() {
  rest
    .put(
      Routes.applicationGuildCommands(
        config.api.discord.clientId,
        config.api.discord.guildId
      ),
      { body: [] }
    )
    .then(() => log.info("Successfully deleted all guild commands."))
    .catch(log.error);
}

switch (argv[2]) {
  case "global":
    deleteGlobalCommands();
    break;
  case "guild":
    deleteGuildCommands();
    break;
  default:
    deleteGlobalCommands();
    deleteGuildCommands();
    break;
}
