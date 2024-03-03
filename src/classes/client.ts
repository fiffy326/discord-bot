import config from "../utils/config.js";
import Discord, { GatewayIntentBits, PresenceStatusData } from "discord.js";

export class Client extends Discord.Client {
  commands: Discord.Collection<any, any>;
  constructor() {
    super({
      presence: { status: <PresenceStatusData>config.bot.status },
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.MessageContent,
      ],
    });
    this.commands = new Discord.Collection();
  }
}

export default Client;
