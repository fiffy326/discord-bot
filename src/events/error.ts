import { Event } from "../bot/event.js";
import { log } from "../utils/log.js";

export default {
  name: "error",
  async callback(message: string) {
    log.error(message);
  },
} as Event;
