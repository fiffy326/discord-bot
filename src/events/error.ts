import { Event } from "@bot/event.js";
import { log } from "@utils/log.js";

export default {
  name: "error",
  async callback(message: string): Promise<void> {
    log.error(message);
  },
} as Event;
