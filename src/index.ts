import config from "../config.json" with { type: "json" };
import Client from "./base/classes/client.js";
import log from "./utils/log.js";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { readdirSync } from "fs";

const client = new Client();

/* Emulate __dirname inside ESM */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/* Load command files */
const dirsPath = join(__dirname, "commands");
const cmdDirs = readdirSync(dirsPath);
for (const dir of cmdDirs) {
  const cmdsPath = join(dirsPath, dir);
  const cmdFiles = readdirSync(cmdsPath).filter(f => f.endsWith(".js"));
  for (const file of cmdFiles) {
    const filePath = join(cmdsPath, file);
    const cmd = (await import(filePath)).default;
    if ("data" in cmd && "execute" in cmd) {
      client.commands.set(cmd.data.name, cmd);
    } else {
      log.warn(`${filePath} is missing a "data" or "execute" property.`);
    }
  }
}

/* Load event files */
const eventsPath = join(__dirname, "events");
const eventFiles = readdirSync(eventsPath).filter(f => f.endsWith(".js"));
for (const file of eventFiles) {
  const filePath = join(eventsPath, file);
  const event = (await import(filePath)).default;
  if (event.once) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    client.once(event.name, (...args: any[]) => event.execute(...args));
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    client.on(event.name, (...args: any[]) => event.execute(...args));
  }
}

client.login(config.apis.discord.token);
