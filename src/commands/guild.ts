import { Command } from "@bot/command.js";
import dayjs from "dayjs";
import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("guild")
    .setDescription("Display guild information")
    .addBooleanOption((option) => option.setName("ephemeral").setDescription("Only show to you (default: false)")),
  async callback(interaction: ChatInputCommandInteraction): Promise<void> {
    // Get optional arguments.
    const ephemeral = interaction.options.getBoolean("ephemeral") ?? false;

    // Make sure the command was used in a guild.
    if (!interaction.inGuild()) {
      await interaction.reply({ content: "This is not a guild", ephemeral: ephemeral });
    }

    // Get the guild that the command was used in.
    const guild = interaction.guild!;

    // Build an embed with the guild's information.
    const embed = new EmbedBuilder()
      .setTitle("Guild Information")
      .setThumbnail(guild.iconURL())
      .setFields(
        { name: "ID", value: guild.id, inline: true },
        { name: "Name", value: guild.name, inline: true },
        { name: "Members", value: guild.memberCount.toString(), inline: true },
        { name: "Roles", value: guild.roles.cache.size.toString(), inline: true },
        { name: "Owner", value: await guild.fetchOwner().then((member) => member.user.tag.toString()), inline: true },
        { name: "Creation Date", value: dayjs(guild.createdTimestamp).format("YYYY-MM-DD"), inline: true },
      );

    // Send a reply with the user information embed.
    await interaction.reply({ embeds: [embed], ephemeral: ephemeral });
  },
} as Command;
