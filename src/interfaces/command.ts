import { SlashCommandBuilder } from "discord.js";

export interface Command {
  data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  execute: (...args: any) => Promise<void>;
}

export default Command;
