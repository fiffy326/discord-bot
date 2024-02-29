import config from "../../../config.json" with { type: "json" };
import Discord, { GatewayIntentBits, PresenceUpdateStatus } from "discord.js";

export class Client extends Discord.Client {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  commands: Discord.Collection<any, any>;
  constructor() {
    let clientStatus: Discord.PresenceStatusData;

    switch (config.bot.status.toLowerCase()) {
      default:
      case "online":
        clientStatus = PresenceUpdateStatus.Online;
        break;

      case "invisible":
      case "offline":
        clientStatus = PresenceUpdateStatus.Invisible;
        break;

      case "afk":
      case "away":
      case "idle":
        clientStatus = PresenceUpdateStatus.Idle;
        break;

      case "dnd":
      case "donotdisturb":
        clientStatus = PresenceUpdateStatus.DoNotDisturb;
        break;
    }

    super({
      presence: { status: clientStatus },
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
