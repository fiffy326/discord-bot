import Event from "../interfaces/event.js";
import log from "../utils/log.js";
import { Events } from "discord.js";

export const event: Event = {
  name: Events.ClientReady,
  once: true,
  async execute(client: any) {
    log.info(`Logged in as ${client.user.tag}`);
  },
};

export default event;
