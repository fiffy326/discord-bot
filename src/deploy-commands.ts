import Command from "./interfaces/command.js";
import config from "./utils/config.js";
import log from "./utils/log.js";
import { readdirSync } from "fs";
import { dirname, join } from "path";
import { argv } from "process";
import { fileURLToPath } from "url";
import { REST, Routes } from "discord.js";

/* Emulate __dirname inside ESM */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/* Load command files */
const cmds = [];
const dirsPath = join(__dirname, "commands");
const cmdDirs = readdirSync(dirsPath);
for (const dir of cmdDirs) {
  const cmdsPath = join(dirsPath, dir);
  const cmdFiles = readdirSync(cmdsPath).filter(f => f.endsWith(".js"));
  for (const file of cmdFiles) {
    const filePath = join(cmdsPath, file);
    const cmd = (await import(filePath)).default;
    if ("data" in cmd && "execute" in cmd) {
      cmds.push(cmd.data.toJSON());
    } else {
      log.warn(`${filePath} is missing a "data" or "execute" property.`);
    }
  }
}

const rest = new REST().setToken(config.api.discord.token);

function deployGlobalCommands(commands: Array<Command>) {
  log.info(`Started deploying ${commands.length} global commands.`);
  rest
    .put(Routes.applicationCommands(config.api.discord.clientId), {
      body: commands,
    })
    .then((data: any) =>
      log.info(`Finished deploying ${data.length} global commands.`)
    )
    .catch(log.error);
}

function deployGuildCommands(commands: Array<Command>) {
  log.info(`Started deploying ${commands.length} guild commands.`);
  rest
    .put(
      Routes.applicationGuildCommands(
        config.api.discord.clientId,
        config.api.discord.guildId
      ),
      { body: commands }
    )
    .then((data: any) =>
      log.info(`Finished deploying ${data.length} guild commands.`)
    )
    .catch(log.error);
}

switch (argv[2]) {
  case "global":
    deployGlobalCommands(cmds);
    break;
  case "guild":
    deployGuildCommands(cmds);
    break;
  default:
    deployGlobalCommands(cmds);
    deployGuildCommands(cmds);
    break;
}
