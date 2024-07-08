import { Command, loadCommandFiles } from "@bot/command.js";
import { loadEventFiles } from "@bot/event.js";
import { Client as DiscordClient, Collection, GatewayIntentBits } from "discord.js";

export class Client extends DiscordClient {
  commands = new Collection<string, Command>();

  constructor(intents?: GatewayIntentBits[]) {
    super({
      intents: intents ?? [
        // Use all gateway intents by default.
        GatewayIntentBits.AutoModerationConfiguration,
        GatewayIntentBits.AutoModerationExecution,
        GatewayIntentBits.DirectMessagePolls,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessagePolls,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.MessageContent,
      ],
    });
  }

  async loadCommands(): Promise<void> {
    const commands = await loadCommandFiles();
    for (const command of commands) {
      this.commands.set(command.data.name, command);
    }
  }

  async loadEvents(): Promise<void> {
    const events = await loadEventFiles();
    for (const event of events) {
      if (event.once) {
        this.once(event.name, (...args: unknown[]) => event.callback(...args));
      } else {
        this.on(event.name, (...args: unknown[]) => event.callback(...args));
      }
    }
  }
}
