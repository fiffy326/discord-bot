import { log } from "../utils/log.js";
import { ClientEvents } from "discord.js";
import { readdirSync } from "node:fs";
import { resolve } from "node:path";

export interface Event {
  name: keyof ClientEvents;
  once?: boolean;
  callback: (...args: unknown[]) => Promise<void>;
}

export async function loadEventFiles(): Promise<Event[]> {
  const events: Event[] = [];
  const dirPath = resolve(import.meta.dirname, "../events");
  const files = readdirSync(dirPath).filter((f) => f.endsWith(".js"));
  for (const file of files) {
    const filePath = resolve(dirPath, file);
    const event: Event = (await import(filePath)).default;
    if (event && "name" in event && "callback" in event) {
      events.push(event);
    } else {
      log.error(`Invalid event file: ${file}`);
    }
  }
  return events;
}
