import Discord, { GatewayIntentBits } from "discord.js";

export class Client extends Discord.Client {
  commands: Discord.Collection<any, any>;
  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent
      ],
    });
    this.commands = new Discord.Collection();
  }
}

export default Client;
