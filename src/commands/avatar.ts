import { Command } from "@bot/command.js";
import { ChatInputCommandInteraction, EmbedBuilder, ImageExtension, ImageSize, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Display a user's avatar image")
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
        .setChoices(
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
    )
    .addBooleanOption((opt) => opt.setName("ephemeral").setDescription("Only show to you (default: false)")),
  async callback(interaction: ChatInputCommandInteraction): Promise<void> {
    // Get the optional arguments.
    const user = interaction.options.getUser("user") ?? interaction.user;
    const format = (interaction.options.getString("format") ?? "webp") as ImageExtension;
    const size = (interaction.options.getInteger("size") ?? 4096) as ImageSize;
    const ephemeral = interaction.options.getBoolean("ephemeral") ?? false;

    // Build an embed with the user's avatar image.
    const embed = new EmbedBuilder()
      .setTitle(`${user.tag}'s Avatar Image`)
      .setImage(user.avatarURL({ extension: format, size: size }));

    // Send a reply with the avatar image embed.
    await interaction.reply({ embeds: [embed], ephemeral: ephemeral });
  },
} as Command;
