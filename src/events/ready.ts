import { Client } from "../bot/client.js";
import { Event } from "../bot/event.js";
import { config } from "../utils/config.js";
import { emoji } from "../utils/emoji.js";
import { log } from "../utils/log.js";
import { ActivityType } from "discord.js";

async function updateName(client: Client): Promise<void> {
  if (client.user?.username !== config.user.name && config.user.name) {
    await client.user?.setUsername(config.user.name);
    log.info(`Set username to ${config.user.name}`);
  }
}

async function updatePresence(client: Client): Promise<void> {
  let activityType: ActivityType;
  switch (config.user.activity?.type) {
    case "playing":
      activityType = ActivityType.Playing;
      break;
    case "watching":
      activityType = ActivityType.Watching;
      break;
    case "listening":
      activityType = ActivityType.Listening;
      break;
    case "streaming":
      activityType = ActivityType.Streaming;
      break;
    case "competing":
      activityType = ActivityType.Competing;
      break;
    case "custom":
    default:
      activityType = ActivityType.Custom;
      break;
  }

  client.user?.setPresence({
    status: config.user.online_status,
    activities: [{ type: activityType, name: config.user.activity?.name ?? "", state: emoji.heart }],
  });

  log.info(`Set online status to ${config.user.online_status}`);
  log.info(`Set activity type to ${config.user.activity?.type}`);
  log.info(`Set activity name to ${config.user.activity?.name}`);
}

export default {
  name: "ready",
  once: true,
  async callback(client: Client): Promise<void> {
    log.info(`Logged into Discord as ${client.user?.tag}`);
    await updateName(client);
    await updatePresence(client);
  },
} as Event;
