import { Command } from "@bot/command.js";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("random")
    .setDescription("Generate a random number")
    .addNumberOption((option) => option.setName("lower").setDescription("Lower limit (default: 0)"))
    .addNumberOption((option) => option.setName("upper").setDescription("Upper limit (default: 100)"))
    .addBooleanOption((option) => option.setName("ephemeral").setDescription("Only show to you (default: false)")),
  async callback(interaction: ChatInputCommandInteraction): Promise<void> {
    // Get the optional arguments.
    const lower = interaction.options.getNumber("lower") ?? 0;
    const upper = interaction.options.getNumber("upper") ?? 100;
    const ephemeral = interaction.options.getBoolean("ephemeral") ?? false;

    // Make sure the arguments are valid.
    if (lower < 0) {
      await interaction.reply({ content: "Minimum lower limit is 0", ephemeral: ephemeral });
      return;
    }
    if (lower >= upper) {
      await interaction.reply({ content: "Upper limit must be greater than the lower limit", ephemeral: ephemeral });
      return;
    }
    if (upper > Number.MAX_SAFE_INTEGER) {
      await interaction.reply({ content: `Maximum upper limit is ${Number.MAX_SAFE_INTEGER}` });
      return;
    }

    // Generate a random number within the given bounds.
    const response = Math.floor(Math.random() * (upper - lower) + lower);

    // Send a reply with the random number.
    await interaction.reply({ content: response.toString(), ephemeral: ephemeral });
  },
} as Command;
