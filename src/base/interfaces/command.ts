import { SlashCommandBuilder } from "discord.js";

export interface Command {
  data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  execute: (...args: any) => Promise<void>;
}

export default Command;
