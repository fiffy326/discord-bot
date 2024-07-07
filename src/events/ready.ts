import { Client } from "../bot/client.js";
import { Event } from "../bot/event.js";
import { log } from "../utils/log.js";

export default {
  name: "ready",
  once: true,
  async callback(client: Client) {
    log.info(`Logged into Discord as ${client.user?.tag}`);
  },
} as Event;
