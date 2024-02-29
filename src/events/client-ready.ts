import log from "../utils/log.js";
import { Events } from "discord.js";

export default {
  name: Events.ClientReady,
  once: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  execute(client: any) {
    log.info(`Logged in as ${client.user.tag}`);
  },
};
