import config from "./utils/config.js";
import log from "./utils/log.js";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { readdirSync } from "fs";
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

/* Deploy guild commands */
const rest = new REST().setToken(config.api.discord.token);
(async () => {
  try {
    log.info(`Started deploying ${cmds.length} guild commands.`);

    const data: any = await rest.put(
      Routes.applicationGuildCommands(
        config.api.discord.clientId,
        config.api.discord.guildId
      ),
      { body: cmds }
    );

    log.info(`Finished deploying ${data.length} guild commands.`);
  } catch (error) {
    log.error(error);
  }
})();
