import { Client } from "@bot/client.js";
import { CommandScope, deleteCommands, deployCommands } from "@bot/command.js";
import { program } from "@commander-js/extra-typings";
import { config } from "@utils/config.js";
import { log } from "@utils/log.js";
import { project } from "@utils/project.js";

function splitList(item: string, items: string[]): string[] {
  return item ? items.concat(item.split(/[,\s]+/)) : items;
}

enum CommandManagerAction {
  DEPLOY,
  DELETE,
}

interface CommandManagerOptions {
  global: boolean;
  guilds: boolean | string[];
  shared: boolean | string[];
}

async function commandManager(action: CommandManagerAction, options: CommandManagerOptions): Promise<void> {
  const globalFlag = options.global;
  const guildsFlag = options.guilds === true || Array.isArray(options.guilds);
  const sharedFlag = options.shared === true || Array.isArray(options.shared);
  const totalFlags = (globalFlag ? 1 : 0) + (guildsFlag ? 1 : 0) + (sharedFlag ? 1 : 0);
  if (totalFlags === 0) {
    log.fatal("Too few options were provided");
    process.exit(1);
  }
  if (totalFlags > 1) {
    log.fatal("Too many options were provided");
    process.exit(1);
  }

  const scope = (() => {
    if (globalFlag) {
      return CommandScope.GLOBAL;
    }
    if (guildsFlag) {
      return CommandScope.GUILDS;
    }
    if (sharedFlag) {
      return CommandScope.SHARED;
    }
  })();

  const guildIds = (() => {
    switch (scope) {
      case CommandScope.GLOBAL:
        return undefined;
      case CommandScope.GUILDS:
        return Array.isArray(options.guilds) && options.guilds.length > 0 ? options.guilds : undefined;
      case CommandScope.SHARED:
        return Array.isArray(options.shared) && options.shared.length > 0 ? options.shared : undefined;
      default:
        log.fatal("Invalid command scope");
        process.exit(1);
    }
  })();

  switch (action) {
    case CommandManagerAction.DEPLOY:
      await deployCommands(scope, guildIds);
      break;
    case CommandManagerAction.DELETE:
      await deleteCommands(scope, guildIds);
      break;
    default:
      log.fatal("Invalid command manager action");
      process.exit(1);
  }
}

async function startBot(): Promise<void> {
  const client = new Client();
  try {
    await client.loadCommands();
    await client.loadEvents();
    await client.login(config.env.DISCORD_TOKEN);
  } catch (e) {
    log.error((e as Error).message);
  }
}

program.name(project.name).description(project.description).version(project.version);
program.command("start", { isDefault: true }).action(async () => startBot());
program
  .command("deploy")
  .description("deploy slash commands (default: shared)")
  .option("-G, --global", "deploy slash commands (global)", false)
  .option("-g, --guilds [ids]", "deploy slash commands (guilds)", splitList, [])
  .option("-s, --shared [ids]", "deploy slash commands (shared)", splitList, [])
  .action(async (options) => commandManager(CommandManagerAction.DEPLOY, options));
program
  .command("delete")
  .description("delete slash commands (default: shared)")
  .option("-G, --global", "delete slash commands (global)", false)
  .option("-g, --guilds [ids]", "delete slash commands (guilds)", splitList, [])
  .option("-s, --shared [ids]", "delete slash commands (shared)", splitList, [])
  .action(async (options) => commandManager(CommandManagerAction.DELETE, options));

process.on("uncaughtException", (e: Error) => {
  log.fatal(`Uncaught exception: ${e.message}`);
  process.exit(1);
});

process.on("unhandledRejection", (e: Error) => {
  log.fatal(`Unhandled rejection: ${e.message}`);
  process.exit(1);
});

await program.parseAsync(process.argv);
