import { Event } from "@bot/event.js";
import { log } from "@utils/log.js";

export default {
  name: "debug",
  async callback(message: string): Promise<void> {
    log.debug(message);
  },
} as Event;
