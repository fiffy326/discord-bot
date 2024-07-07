import { config } from "../utils/config.js";
import { log } from "../utils/log.js";
import { REST, Routes, SlashCommandBuilder } from "discord.js";
import { readdirSync } from "node:fs";
import { resolve } from "node:path";

export enum CommandScope {
  SHARED,
  GLOBAL,
  GUILDS,
}

export interface Command {
  data: SlashCommandBuilder;
  callback: (...args: unknown[]) => Promise<void>;
}

export async function loadCommandFiles(): Promise<Command[]> {
  const commands: Command[] = [];
  const dirPath = resolve(import.meta.dirname, "../commands");
  const files = readdirSync(dirPath).filter((f) => f.endsWith(".js"));
  for (const file of files) {
    const filePath = resolve(dirPath, file);
    const command: Command = (await import(filePath)).default;
    if (command && "data" in command && "callback" in command) {
      commands.push(command);
    } else {
      log.error(`Invalid command file: ${file}`);
    }
  }
  return commands;
}

const rest = new REST({ version: "10" }).setToken(config.environment.DISCORD_TOKEN);

async function deleteGlobalCommands(): Promise<void> {
  await rest
    .put(Routes.applicationCommands(config.user.id), { body: [] })
    .then(() => log.info("Deleted all commands (global)"))
    .catch((e) => log.error(e.message));
}

async function deployGlobalCommands(): Promise<void> {
  const payload = (await loadCommandFiles()).map((c) => c.data.toJSON());
  await rest
    .put(Routes.applicationCommands(config.user.id), { body: payload })
    .then(() => log.info("Deployed all commands (global)"))
    .catch((e) => log.error(e.message));
}

async function deleteGuildCommands(guildIds?: string[]): Promise<void> {
  guildIds = guildIds ?? config.guilds.filter((g) => g.deploy_commands).map((g) => g.id) ?? [];
  for (const guildId of guildIds) {
    await rest
      .put(Routes.applicationGuildCommands(config.user.id, guildId), { body: [] })
      .then(() => log.info(`Deleted all commands (guild: ${guildId})`))
      .catch((e) => log.error(e.message));
  }
}

async function deployGuildCommands(guildIds?: string[]): Promise<void> {
  const payload = (await loadCommandFiles()).map((c) => c.data.toJSON());
  guildIds = guildIds ?? config.guilds.filter((g) => g.deploy_commands).map((g) => g.id) ?? [];
  for (const guildId of guildIds) {
    await rest
      .put(Routes.applicationGuildCommands(config.user.id, guildId), { body: payload })
      .then(() => log.info(`Deployed all commands (guild: ${guildId})`))
      .catch((e) => log.error(e.message));
  }
}

export async function deleteCommands(scope?: CommandScope, guildIds?: string[]): Promise<void> {
  switch (scope) {
    case CommandScope.GLOBAL:
      await deleteGlobalCommands();
      break;
    case CommandScope.GUILDS:
      await deleteGuildCommands(guildIds);
      break;
    case CommandScope.SHARED:
    default:
      await deleteGlobalCommands();
      await deleteGuildCommands(guildIds);
      break;
  }
}

export async function deployCommands(scope?: CommandScope, guildIds?: string[]): Promise<void> {
  switch (scope) {
    case CommandScope.GLOBAL:
      await deployGlobalCommands();
      break;
    case CommandScope.GUILDS:
      await deployGuildCommands(guildIds);
      break;
    case CommandScope.SHARED:
    default:
      await deployGlobalCommands();
      await deployGuildCommands(guildIds);
      break;
  }
}
