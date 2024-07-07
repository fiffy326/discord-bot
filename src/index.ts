import { Client } from "./bot/client.js";
import { CommandScope, deleteCommands, deployCommands } from "./bot/command.js";
import { config } from "./utils/config.js";
import { log } from "./utils/log.js";
import { packageInfo } from "./utils/package-info.js";
import { program } from "commander";

program.name(packageInfo.name).description(packageInfo.description).version(packageInfo.version);

program
  .command("start", { isDefault: true })
  .description("start the bot")
  .action(async () => {
    const client = new Client();
    await client
      .login(config.environment.DISCORD_TOKEN)
      .then(() => client.loadEvents())
      .then(() => client.loadCommands())
      .catch((e) => log.error(e.message));
  });

program
  .command("deploy")
  .description("deploy slash commands (default: 'shared')")
  .option("-g, --global", "deploy slash commands (global)", false)
  .option(
    "-G, --guilds [ids]",
    "deploy commands (guilds)",
    (guildId: string, guildIds: string[]) => {
      return guildId ? guildIds.concat(guildId.split(/[,\s]+/)) : guildIds;
    },
    [],
  )
  .option(
    "-s, --shared [ids]",
    "deploy commands (shared)",
    (guildId: string, guildIds: string[]) => {
      return guildId ? guildIds.concat(guildId.split(/[,\s]+/)) : guildIds;
    },
    [],
  )
  .action(async (options) => {
    const globalFlag: boolean = options.global;
    const guildsFlag: boolean = options.guilds.length !== 0;
    const sharedFlag: boolean = options.shared.length !== 0;

    const optionCount: number = (globalFlag ? 1 : 0) + (guildsFlag ? 1 : 0) + (sharedFlag ? 1 : 0);
    if (optionCount > 1) {
      log.fatal("Too many options were provided");
      process.exit(1);
    }

    let scope = CommandScope.SHARED;
    scope = globalFlag ? CommandScope.GLOBAL : scope;
    scope = guildsFlag ? CommandScope.GUILDS : scope;
    scope = sharedFlag ? CommandScope.SHARED : scope;

    let guildIds = options.guilds ?? options.shared ?? undefined;
    guildIds = guildIds === true ? undefined : guildIds;
    guildIds = Array.isArray(guildIds) && guildIds.length === 0 ? undefined : guildIds;

    await deployCommands(scope, guildIds);
  });

program
  .command("delete")
  .description("delete slash commands (default: 'shared')")
  .option("-g, --global", "delete slash commands (global)", false)
  .option(
    "-G, --guilds [ids]",
    "delete commands (guilds)",
    (guildId: string, guildIds: string[]) => {
      return guildId ? guildIds.concat(guildId.split(/[,\s]+/)) : guildIds;
    },
    [],
  )
  .option(
    "-s, --shared [ids]",
    "delete commands (shared)",
    (guildId: string, guildIds: string[]) => {
      return guildId ? guildIds.concat(guildId.split(/[,\s]+/)) : guildIds;
    },
    [],
  )
  .action(async (options) => {
    const globalFlag: boolean = options.global;
    const guildsFlag: boolean = options.guilds.length !== 0;
    const sharedFlag: boolean = options.shared.length !== 0;

    const optionCount: number = (globalFlag ? 1 : 0) + (guildsFlag ? 1 : 0) + (sharedFlag ? 1 : 0);
    if (optionCount > 1) {
      log.fatal("Too many options were provided");
      process.exit(1);
    }

    let scope = CommandScope.SHARED;
    scope = globalFlag ? CommandScope.GLOBAL : scope;
    scope = guildsFlag ? CommandScope.GUILDS : scope;
    scope = sharedFlag ? CommandScope.SHARED : scope;

    let guildIds = options.guilds ?? options.shared ?? undefined;
    guildIds = guildIds === true ? undefined : guildIds;
    guildIds = Array.isArray(guildIds) && guildIds.length === 0 ? undefined : guildIds;

    await deleteCommands(scope, guildIds);
  });

program.parse(process.argv);
