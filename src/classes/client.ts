import Discord, { GatewayIntentBits } from "discord.js";

export class Client extends Discord.Client {
  commands: Discord.Collection<any, any>;
  constructor(intents: Array<GatewayIntentBits>) {
    super({ intents: intents });
    this.commands = new Discord.Collection();
  }
}

export default Client;
