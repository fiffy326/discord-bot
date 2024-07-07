import { Command } from "../bot/command.js";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Calculate the bot's latency")
    .addBooleanOption((option) =>
      option.setName("ephemeral").setDescription("Only show response to you (default: false)"),
    ),
  async callback(interaction: ChatInputCommandInteraction) {
    const ephemeral = interaction.options.getBoolean("ephemeral") ?? false;
    const pingReply = await interaction.reply({ content: "Calculating...", fetchReply: true, ephemeral: ephemeral });
    const heartbeat = `Heartbeat: ${interaction.client.ws.ping} ms`;
    const roundTrip = `RoundTrip: ${pingReply.createdTimestamp - interaction.createdTimestamp} ms`;
    const response = `${heartbeat}\n${roundTrip}`;
    await interaction.editReply({ content: response });
  },
} as Command;
