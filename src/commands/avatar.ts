import { Command } from "../bot/command.js";
import { ChatInputCommandInteraction, EmbedBuilder, ImageExtension, ImageSize, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Display a user's avatar image")
    .addBooleanOption((option) =>
      option.setName("ephemeral").setDescription("Only show response to you (default: false)"),
    )
    .addUserOption((option) => option.setName("user").setDescription("User who's avatar to display (default: self)"))
    .addStringOption((option) =>
      option
        .setName("format")
        .setDescription("Image format (default: webp)")
        .setChoices(
          { name: "webp", value: "webp" },
          { name: "png", value: "png" },
          { name: "jpg", value: "jpg" },
          { name: "gif", value: "gif" },
        ),
    )
    .addIntegerOption((option) =>
      option
        .setName("size")
        .setDescription("Image size (default: 4096x4096)")
        .addChoices(
          { name: "16x16", value: 16 },
          { name: "32x32", value: 32 },
          { name: "64x64", value: 64 },
          { name: "128x128", value: 128 },
          { name: "256x256", value: 256 },
          { name: "512x512", value: 512 },
          { name: "1024x1024", value: 1024 },
          { name: "2048x2048", value: 2048 },
          { name: "4096x4096", value: 4096 },
        ),
    ),
  async callback(interaction: ChatInputCommandInteraction) {
    const ephemeral = interaction.options.getBoolean("ephemeral") ?? false;
    const user = interaction.options.getUser("user") ?? interaction.user;
    const format = (interaction.options.getString("format") ?? "webp") as ImageExtension;
    const size = (interaction.options.getInteger("size") ?? 4096) as ImageSize;

    const imageUrl = user.displayAvatarURL({ extension: format, size: size });

    const embed = new EmbedBuilder().setTitle(`${user.tag}'s Avatar`).setImage(imageUrl);
    await interaction.reply({ embeds: [embed], ephemeral: ephemeral });
  },
} as Command;
