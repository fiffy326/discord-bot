import { Event } from "../bot/event.js";
import { log } from "../utils/log.js";

export default {
  name: "warn",
  async callback(message: string) {
    log.warn(message);
  },
} as Event;
