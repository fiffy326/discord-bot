import config from "../utils/config.js";
import Event from "../interfaces/event.js";
import log from "../utils/log.js";
import { ActivityType, Client, Events, PresenceStatusData } from "discord.js";

export const event: Event = {
  name: Events.ClientReady,
  once: true,
  async execute(client: Client) {
    log.info(`Logged in as ${client.user!.tag}`);
    if (config.bot.username) client.user!.setUsername(config.bot.username);
    if (config.bot.avatarURL) client.user!.setAvatar(config.bot.avatarURL);

    let activityType: ActivityType | undefined;
    switch (config.bot.activityType) {
      case "playing":
        activityType = ActivityType.Playing;
        break;
      case "listening":
        activityType = ActivityType.Listening;
        break;
      case "watching":
        activityType = ActivityType.Watching;
        break;
      case "streaming":
        activityType = ActivityType.Streaming;
        break;
      case "competing":
        activityType = ActivityType.Competing;
        break;
      case "custom":
        activityType = ActivityType.Custom;
        break;
      default:
        activityType = undefined;
        break;
    }

    client.user!.setPresence({
      afk: false,
      status: <PresenceStatusData>config.bot.status,
      activities: [{ type: activityType, name: config.bot.activityName }],
    });
  },
};

export default event;
