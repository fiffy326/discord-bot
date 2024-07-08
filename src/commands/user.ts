import { Command } from "@bot/command.js";
import dayjs from "dayjs";
import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Display user information")
    .addUserOption((option) =>
      option.setName("user").setDescription("User who's information to display (default: self)"),
    )
    .addBooleanOption((option) => option.setName("ephemeral").setDescription("Only show to you (default: false)")),
  async callback(interaction: ChatInputCommandInteraction): Promise<void> {
    // Get the optional arguments.
    const user = interaction.options.getUser("user") ?? interaction.user;
    const ephemeral = interaction.options.getBoolean("ephemeral") ?? false;

    // Build an embed with the user's information.
    const embed = new EmbedBuilder()
      .setTitle(`${user.bot ? "Bot" : "User"} Information`)
      .setThumbnail(user.avatarURL())
      .setFields(
        { name: "ID", value: user.id, inline: true },
        { name: "Tag", value: user.tag, inline: true },
        { name: "Display Name", value: user.displayName, inline: true },
        { name: "Creation Date", value: dayjs(user.createdTimestamp).format("YYYY-MM-DD"), inline: true },
      );

    // Send a reply with the user information embed.
    await interaction.reply({ embeds: [embed], ephemeral: ephemeral });
  },
} as Command;
