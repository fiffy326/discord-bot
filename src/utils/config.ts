import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "smol-toml";
import { z } from "zod";

const snowflake = z.string().regex(/^\d{17,19}$/);
const logLevel = z.enum(["fatal", "error", "warn", "info", "debug", "trace"]);
const onlineStatus = z.enum(["online", "idle", "dnd", "invisible"]);
const activityType = z.enum(["custom", "playing", "watching", "listening", "streaming", "competing"]);

const userActivitySchema = z.object({
  type: activityType.default("custom"),
  name: z.string().max(128),
});

const userSchema = z.object({
  id: snowflake,
  name: z.string().min(2).max(32).optional(),
  online_status: onlineStatus.default("online"),
  activity: userActivitySchema.optional(),
});

const guildSchema = z.object({
  id: snowflake,
  deploy_commands: z.boolean().default(false),
  join_channel_id: snowflake.optional(),
});

const relaySchema = z.object({
  webhook_id: snowflake,
  webhook_token: z.string().length(68),
  guild_ids: z.array(snowflake).default([]),
  channel_ids: z.array(snowflake).default([]),
  user_ids: z.array(snowflake).default([]),
});

const logConsoleSchema = z.object({
  level: logLevel.default("info"),
});

const logFileSchema = z.object({
  level: logLevel.optional(),
  max_days: z.number().default(14),
  compress: z.boolean().default(false),
});

const logSchema = z.object({
  console: logConsoleSchema.default({}),
  file: logFileSchema.default({}),
});

const environmentSchema = z.object({
  DISCORD_TOKEN: z.string().default(process.env.DISCORD_TOKEN ?? ""),
  OPENAI_API_TOKEN: z.string().default(process.env.OPENAI_API_TOKEN ?? ""),
  DB_HOST: z.string().default(process.env.DB_HOST ?? ""),
  DB_PORT: z.number().default(parseInt(process.env.DB_PORT ?? "")),
  DB_NAME: z.string().default(process.env.DB_NAME ?? ""),
  DB_USER: z.string().default(process.env.DB_USER ?? ""),
  DB_PASS: z.string().default(process.env.DB_PASS ?? ""),
});

const configSchema = z.object({
  user: userSchema,
  guilds: z.array(guildSchema).default([]),
  relays: z.array(relaySchema).default([]),
  log: logSchema.default({}),
  environment: environmentSchema.default({}),
});

function parseConfig(relativePath: string): z.infer<typeof configSchema> {
  const absolutePath = resolve(import.meta.dirname, relativePath);
  const fileText = readFileSync(absolutePath, "utf8");
  const fileToml = parse(fileText);
  try {
    return configSchema.parse(fileToml);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

export const config = parseConfig("../../config.toml");
