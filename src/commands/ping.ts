import { Command } from "@bot/command.js";
import { emoji } from "@utils/emoji.js";
import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Display bot latency information")
    .addBooleanOption((option) => option.setName("ephemeral").setDescription("Only show to you (default: false)")),
  async callback(interaction: ChatInputCommandInteraction): Promise<void> {
    // Get the optional arguments.
    const ephemeral = interaction.options.getBoolean("ephemeral") ?? false;

    // Send an initial reply to use in the round-trip latency calculation.
    const initialReply = await interaction.reply({ content: "Pinging...", fetchReply: true, ephemeral: ephemeral });

    // Calculate the round-trip latency.
    const roundTripLabel = `RoundTrip ${emoji.arrows_counterclockwise}`;
    const roundTripValue = `${initialReply.createdTimestamp - interaction.createdTimestamp} ms`;

    // Get the WebSocket latency.
    const heartbeatLabel = `Heartbeat ${emoji.heart}`;
    const heartbeatValue = `${interaction.client.ws.ping} ms`;

    // Get the bot's avatar image.
    const avatarImageUrl = interaction.client.user.displayAvatarURL();

    // Build an embed with the latency information.
    const embed = new EmbedBuilder()
      .setTitle("Bot Latency Information")
      .setThumbnail(avatarImageUrl)
      .setFields(
        { name: heartbeatLabel, value: heartbeatValue, inline: false },
        { name: roundTripLabel, value: roundTripValue, inline: false },
      );

    // Update the reply with the latency information.
    await interaction.editReply({ embeds: [embed] });
  },
} as Command;
