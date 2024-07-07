import { Event } from "../bot/event.js";
import { log } from "../utils/log.js";

export default {
  name: "debug",
  async callback(message: string) {
    log.debug(message);
  },
} as Event;
