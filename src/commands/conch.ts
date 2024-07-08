import { Command } from "@bot/command.js";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("conch")
    .setDescription("Generate a Magic Conch answer")
    .addBooleanOption((option) => option.setName("ephemeral").setDescription("Only show to you (default: false)")),
  async callback(interaction: ChatInputCommandInteraction): Promise<void> {
    // Get the optional arguments.
    const ephemeral = interaction.options.getBoolean("ephemeral") ?? false;

    // Select a random Magic Conch response.
    const responses = [
      "Maybe someday.",
      "Nothing.",
      "Neither.",
      "I don't think so.",
      "No.",
      "Yes.",
      "Try asking again.",
      "You cannot get to the top by sitting on your bottom.",
      "I see a new sauce in your future.",
      "Ask next time.",
      "Follow the seahorse.",
    ];
    const response = responses[Math.floor(Math.random() * responses.length)];

    // Send a reply with the selected Magic Conch response.
    await interaction.reply({ content: response, ephemeral: ephemeral });
  },
} as Command;
